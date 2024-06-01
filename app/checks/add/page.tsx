"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function AppCheck() {
  const [preview, setPreview] = useState("");
  const onImageChnage = () => {};
  return (
    <div>
      <form className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
        >
          <PhotoIcon className="w-20" />
          <div className="text-neutral-400 text-sm">Add Photo</div>
        </label>
        <input
          onChange={onImageChnage}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input name="title" required placeholder="Title" type="text" />
        <Input name="amount" required placeholder="Amount" type="number" />
        <Input
          name="decription"
          required
          placeholder="Decription"
          type="text"
        />
        <Button text="Confirm" />
      </form>
    </div>
  );
}
