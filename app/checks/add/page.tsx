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
import { useFormState } from "react-dom";

export default function AddCheck() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
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

    if (await getIsCloudflare()) {
      const { success, result } = await getUploadUrl();
      if (success) {
        const { id, uploadURL } = result;
        setUploadUrl(uploadURL);
        setPhotoId(id);
      }
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const isCloudflare = await getIsCloudflare();
    if (isCloudflare) {
      console.log(isCloudflare);
      const file = formData.get("photo");
      if (!file) {
        return;
      }

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

      const cloudflarePhotoUrl = await getCloudflarePhotoUrl();
      const photoUrl = `${cloudflarePhotoUrl}/${photoId}`;
      // replace `photo` in formData
      formData.set("photo", photoUrl);
    }

    // call uploadCheck()
    return uploadCheck(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
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
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="amount"
          required
          placeholder="Amount"
          type="number"
          step="0.01"
          errors={state?.fieldErrors.amount}
        />
        <Input
          name="description"
          placeholder="Description"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="Confirm" />
      </form>
    </div>
  );
}
