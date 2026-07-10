"use client";

import { useEffect, useState } from "react";
import {
  BusinessProfile,
  getBusinessProfile,
  saveBusinessProfile,
} from "@/lib/storage";

const emptyProfile: BusinessProfile = {
  businessName: "",
  businessPhone: "",
  businessAddress: "",
};

export function BusinessSettingsForm() {
  const [profile, setProfile] = useState<BusinessProfile>(emptyProfile);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const stored = getBusinessProfile();

    if (stored) {
      setProfile({
        businessName: stored.businessName || "",
        businessPhone: stored.businessPhone || "",
        businessAddress: stored.businessAddress || "",
      });
    }
  }, []);

  function updateProfile(key: keyof BusinessProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));

    setSavedMessage("");
  }

  function handleSave() {
    if (!profile.businessName.trim()) {
      alert("Business name is required.");
      return;
    }

    saveBusinessProfile({
      businessName: profile.businessName.trim(),
      businessPhone: profile.businessPhone?.trim(),
      businessAddress: profile.businessAddress?.trim(),
    });

    setSavedMessage("Business profile saved.");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          Business Account
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
          Save your business details
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          These details will appear on every receipt automatically.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-bold text-zinc-700">
            Business name
          </label>
          <input
            value={profile.businessName}
            onChange={(event) =>
              updateProfile("businessName", event.target.value)
            }
            placeholder="e.g. Emmanuel Stores"
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-zinc-700">
            Business phone
          </label>
          <input
            value={profile.businessPhone}
            onChange={(event) =>
              updateProfile("businessPhone", event.target.value)
            }
            placeholder="e.g. 08012345678"
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-zinc-700">
            Business address
          </label>
          <textarea
            value={profile.businessAddress}
            onChange={(event) =>
              updateProfile("businessAddress", event.target.value)
            }
            placeholder="e.g. Shop 12, Computer Village, Ikeja"
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-zinc-300 px-4 py-4 text-base font-semibold outline-none ring-zinc-950 placeholder:text-zinc-300 focus:ring-2"
          />
        </div>
      </div>

      {savedMessage && (
        <div className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          {savedMessage}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-black text-white hover:bg-zinc-800">
          Save business profile
        </button>
      </div>
    </div>
  );
}
