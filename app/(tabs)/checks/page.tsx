import ListCheck from "@/components/list-check";
import db from "@/lib/db";

async function getCheckes() {
  const checks = await db.check.findMany({
    select: {
      title: true,
      amount: true,
      created_at: true,
      photo: true,
      id: true,
    },
  });
  return checks;
}

export default async function Check() {
  const checks = await getCheckes();
  return (
    <div className="p-5 flex flex-col gap-5">
      {checks.map((check) => (
        <ListCheck key={check.id} {...check} />
      ))}
    </div>
  );
}
