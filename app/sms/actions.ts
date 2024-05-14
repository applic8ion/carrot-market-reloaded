"use server";

export default async function smsVerification(
    prevState: any,
    formData: FormData
) {
    const phone = formData.get("phone");
    const token = formData.get("token");

    console.log(phone, token);
}
