import { Separator } from "@/components/ui/separator";

export default function GeneralSetting() {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">General</h3>
        <p className="text-muted-foreground">
          Manage your general information.
        </p>
      </div>
      <Separator className="my-6" />
      <div>
        <label className="block text-sm text-gray-500">Cooming soon!</label>
      </div>
    </div>
  );
}
