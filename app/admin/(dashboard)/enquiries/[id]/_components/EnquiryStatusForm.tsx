"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/lib/enquiryStatus";

export function EnquiryStatusForm({
  enquiryId,
  currentStatus,
}: {
  enquiryId: string;
  currentStatus: EnquiryStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<EnquiryStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not update the enquiry status.");
        return;
      }

      toast.success("Enquiry status updated.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status} onValueChange={(v) => setStatus(v as EnquiryStatus)}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {ENQUIRY_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {ENQUIRY_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSave} disabled={saving || status === currentStatus}>
        {saving ? "Saving…" : "Update Status"}
      </Button>
    </div>
  );
}
