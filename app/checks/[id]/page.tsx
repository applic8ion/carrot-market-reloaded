async function getCheck() {
  await new Promise((resolve) => setTimeout(resolve, 60000));
}

export default async function CheckDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const check = await getCheck();
  return <span>Check detail of the check {id}</span>;
}
