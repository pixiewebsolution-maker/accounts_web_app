"use client";
import Topbar from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/ui";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" subtitle="Manage your account and preferences" onMobileMenu={() => {}} />
      <PageWrapper>
        <div className="max-w-2xl space-y-6">
          {/* Profile */}
          <div className="card p-6">
            <h2 className="font-bold text-white mb-4">Profile Settings</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar" style={{ width: 64, height: 64, fontSize: "1rem" }}>SF</div>
              <div>
                <p className="font-semibold text-white">Syed Farhan PN</p>
                <p className="text-xs" style={{ color: "#475569" }}>Agency Owner & Admin</p>
                <button className="btn btn-secondary mt-2" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>Change Photo</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: "Syed Farhan PN" },
                { label: "Email", value: "syedfarhanpn@gmail.com" },
                { label: "Phone", value: "+91 90484 68404" },
                { label: "Company", value: "Pixie Webs" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#475569" }}>{label}</label>
                  <input defaultValue={value} />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Company */}
          <div className="card p-6">
            <h2 className="font-bold text-white mb-4">Company Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Company Name", value: "Pixie Webs" },
                { label: "GST Number", value: "" },
                { label: "PAN Number", value: "" },
                { label: "City", value: "Kalamassery, Kerala" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#475569" }}>{label}</label>
                  <input defaultValue={value} />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Invoice */}
          <div className="card p-6">
            <h2 className="font-bold text-white mb-4">Invoice Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#475569" }}>Default GST Rate</label>
                <select defaultValue="18">
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#475569" }}>Invoice Prefix</label>
                <input defaultValue="INV" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
