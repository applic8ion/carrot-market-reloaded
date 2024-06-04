"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import {
  getCloudflarePhotoUrl,
  getIsCloudflare,
  getUploadUrl,
  uploadCheck,
} from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckType, checkSchema } from "./schema";
import { getNow } from "@/lib/utils";

export default function AddCheck() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CheckType>({
    resolver: zodResolver(checkSchema),
  });
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      return;
    }

    const file = files[0];

    // Check if the file type is not an image
    if (!file.type.startsWith("image")) {
      return { error: "This is not an image file." };
    }

    // Check if the file size exceeds 4MB
    if (file.size > 4 * 1024 * 1024) {
      return { error: "The file size exceeds 4MB." };
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    if (await getIsCloudflare()) {
      const { success, result } = await getUploadUrl();
      if (success) {
        const { id, uploadURL } = result;
        setUploadUrl(uploadURL);
        const cloudflarePhotoUrl = getCloudflarePhotoUrl();
        setValue("photo", `${cloudflarePhotoUrl}/${id}`);
      }
    } else {
      setValue("photo", `${getNow()}_${file.name}`);
    }
  };

  const onSubmit = handleSubmit(async (data: CheckType) => {
    const isCloudflare = await getIsCloudflare();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("amount", data.amount + "");
    formData.append("description", data.description);

    if (isCloudflare) {
      // upload image to cloudflare
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "post",
        body: cloudflareForm,
      });

      if (response.status !== 200) {
        return;
      }

      formData.append("photo", data.photo);
    } else {
      formData.append("photo", file);
    }

    // call uploadCheck()
    const errors = await uploadCheck(formData);
    if (errors) {
      // setError("")
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                Add Photo
                {errors.photo?.message}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*, application/pdf"
          className="hidden"
        />
        <Input
          required
          placeholder="Title"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          required
          placeholder="Amount"
          type="number"
          step="0.01"
          {...register("amount")}
          errors={[errors.amount?.message ?? ""]}
        />
        <Input
          placeholder="Description"
          type="text"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="Confirm" />
      </form>
    </div>
  );
}
