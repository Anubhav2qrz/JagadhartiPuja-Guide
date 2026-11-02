"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dataStore } from "@/lib/data/store";
import {
  Pandal,
  Locality,
  Place,
  Announcement,
  Submission,
  PandalCategory,
  PlaceCategory,
  SubmissionStatus,
} from "@/types";
import {
  isValidCoordinate,
  isKrishnanagarVicinity,
  Coordinate,
} from "@/lib/maps";
import { AdminMapPicker } from "@/components/map/AdminMapPicker";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  MapPin,
  Utensils,
  Bell,
  MessageSquare,
  Lock,
  LogOut,
  ExternalLink,
  Save,
  X,
  FileCheck,
  Upload,
  Image as ImageIcon,
  Search,
  Compass,
  ChevronDown,
  ChevronUp,
  Navigation,
  Copy,
  Cloud,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  searchAddressGeocode,
  KNOWN_KRISHNANAGAR_LOCATIONS,
  LocationSuggestion,
} from "@/lib/geocoding";
import GoogleMapsAddressSearch from "@/components/map/GoogleMapsAddressSearch";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Dashboard Data State
  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "pandals" | "localities" | "places" | "announcements" | "submissions"
  >("pandals");

  // Editing / Creation States
  const [editingPandal, setEditingPandal] = useState<Partial<Pandal> | null>(
    null
  );
  const [editingPlace, setEditingPlace] = useState<Partial<Place> | null>(null);
  const [editingLocality, setEditingLocality] =
    useState<Partial<Locality> | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Partial<Announcement> | null>(null);

  // Form notification
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Address search / geocoding state
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showAdvancedCoords, setShowAdvancedCoords] = useState(false);

  // Supabase Cloud Sync State
  const [isSyncingToCloud, setIsSyncingToCloud] = useState<boolean>(false);
  const [cloudSyncResult, setCloudSyncResult] = useState<{
    success: boolean;
    message: string;
    is_permission_error?: boolean;
    technical_details?: string;
    sql_fix?: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    // Check server session cookie first
    const checkServerSession = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch {
        // Fallback to local session if network unavailable
        const storedAuth = sessionStorage.getItem("jd_admin_session");
        if (storedAuth === "true") {
          setIsAuthenticated(true);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkServerSession();
    refreshData();
  }, []);

  const refreshData = () => {
    setPandals(dataStore.getPandals({ includeUnpublished: true }));
    setLocalities(dataStore.getLocalities());
    setPlaces(dataStore.getPlaces());
    setAnnouncements(dataStore.getAnnouncements());
    setSubmissions(dataStore.getSubmissions());
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmittingAuth(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("jd_admin_session", "true");
        setAuthError("");
        refreshData();
      } else {
        setAuthError(
          data.error || "Invalid email or password. Please try again."
        );
      }
    } catch {
      setAuthError(
        "Unable to connect to authentication service. Please try again."
      );
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Ignore network errors on signout
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem("jd_admin_session");
  };

  // SUPABASE CLOUD SYNC ACTION
  const handleSyncToCloud = async () => {
    setIsSyncingToCloud(true);
    setCloudSyncResult(null);
    try {
      const res = await dataStore.syncToCloud();
      setIsSyncingToCloud(false);
      if (res.success) {
        setCloudSyncResult({
          success: true,
          message: `Successfully synchronized ${res.count || pandals.length} pandals & coordinates to Supabase Cloud!`,
        });
        showSuccess("☁️ Cloud database synchronized with Supabase!");
      } else {
        setCloudSyncResult({
          success: false,
          message:
            res.error || "Failed to synchronize with Supabase Cloud",
          is_permission_error: res.is_permission_error,
          sql_fix: res.sql_fix,
        });
      }
    } catch (err: any) {
      setIsSyncingToCloud(false);
      setCloudSyncResult({
        success: false,
        message: "Sync failed due to connection error. Please try again.",
      });
    }
  };

  // PANDAL ACTIONS
  const handleSavePandal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPandal || !editingPandal.name) return;

    dataStore.savePandal(editingPandal as any);
    refreshData();
    setEditingPandal(null);
    showSuccess("Pandal listing and coordinates saved successfully!");

    // Background sync to Supabase Cloud
    dataStore.syncToCloud().catch(() => {});
  };

  const handleDeletePandal = (id: string) => {
    if (confirm("Are you sure you want to delete this pandal listing?")) {
      dataStore.deletePandal(id);
      refreshData();
      showSuccess("Pandal deleted.");
    }
  };

  const handleTogglePublish = (pandal: Pandal) => {
    dataStore.savePandal({
      ...pandal,
      is_published: !pandal.is_published,
    });
    refreshData();
  };

  const handleToggleVerify = (pandal: Pandal) => {
    const isNowVerified = !pandal.is_verified;
    dataStore.savePandal({
      ...pandal,
      is_verified: isNowVerified,
      verified_at: isNowVerified ? new Date().toISOString() : null,
    });
    refreshData();
    showSuccess(
      isNowVerified
        ? "Marked as GPS Verified."
        : "Marked as Verification Pending."
    );
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && editingPandal) {
        setEditingPandal({
          ...editingPandal,
          cover_image_url: dataUrl,
        });
        showSuccess("Thumbnail updated from uploaded picture!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && editingPandal) {
        const currentGallery = editingPandal.gallery || [];
        setEditingPandal({
          ...editingPandal,
          gallery: [...currentGallery, dataUrl],
        });
        showSuccess("Photo added to pandal gallery!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSetAsThumbnail = (imgUrl: string) => {
    if (!editingPandal) return;
    const oldCover = editingPandal.cover_image_url;
    const updatedGallery = (editingPandal.gallery || []).filter(
      (g) => g !== imgUrl
    );
    if (oldCover && oldCover !== imgUrl) {
      updatedGallery.unshift(oldCover);
    }
    setEditingPandal({
      ...editingPandal,
      cover_image_url: imgUrl,
      gallery: updatedGallery,
    });
    showSuccess("Image promoted to main thumbnail!");
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    if (!editingPandal) return;
    const currentGallery = [...(editingPandal.gallery || [])];
    currentGallery.splice(index, 1);
    setEditingPandal({
      ...editingPandal,
      gallery: currentGallery,
    });
  };

  const handleOpenPandalModal = (pandal: Partial<Pandal>) => {
    setEditingPandal(pandal);
    const locName =
      typeof pandal.locality === "object" && pandal.locality !== null
        ? pandal.locality.name
        : typeof pandal.locality === "string"
        ? pandal.locality
        : "";
    setAddressSearchQuery(pandal.address || locName || pandal.name || "");
    setShowAdvancedCoords(false);
  };

  const handleSelectLocation = (loc: LocationSuggestion) => {
    if (!editingPandal) return;
    setEditingPandal({
      ...editingPandal,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      is_verified: true,
      verified_at: new Date().toISOString(),
    });
    setAddressSearchQuery(loc.title);
    showSuccess(`📍 Pinned at: ${loc.title}`);
  };

  const handleLocateCurrentPosition = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!editingPandal) return;
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setEditingPandal({
          ...editingPandal,
          latitude: lat,
          longitude: lng,
          is_verified: true,
          verified_at: new Date().toISOString(),
        });
        showSuccess(`📍 Positioned to device GPS: ${lat}, ${lng}`);
      },
      (err) => {
        alert(`Location permission denied or unavailable: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCopyCoordinates = () => {
    if (editingPandal?.latitude && editingPandal?.longitude) {
      const coordStr = `${editingPandal.latitude.toFixed(6)}, ${editingPandal.longitude.toFixed(6)}`;
      navigator.clipboard.writeText(coordStr);
      showSuccess(`Copied GPS coordinates: ${coordStr}`);
    }
  };

  const handleSearchAddress = async (customQuery?: string) => {
    const query = (
      customQuery ||
      addressSearchQuery ||
      editingPandal?.address ||
      editingPandal?.name ||
      ""
    ).trim();

    if (!query || !editingPandal) return;
    setIsGeocoding(true);

    try {
      const result = await searchAddressGeocode(query);
      setIsGeocoding(false);
      if (result) {
        setEditingPandal({
          ...editingPandal,
          address: result.address,
          latitude: result.coord.latitude,
          longitude: result.coord.longitude,
          is_verified: true,
          verified_at: new Date().toISOString(),
        });
        setAddressSearchQuery(result.address);
        showSuccess(`Location found & pinned for: "${query}"!`);
      } else {
        showSuccess(`Address searched. Click anywhere on the map to place the pin.`);
      }
    } catch {
      setIsGeocoding(false);
    }
  };

  // SUBMISSIONS ACTIONS
  const handleUpdateSubmission = (id: string, status: SubmissionStatus) => {
    dataStore.updateSubmissionStatus(id, status);
    refreshData();
    showSuccess(`Submission status updated to: ${status}`);
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // 1. SIGN IN SCREEN IF NOT AUTHENTICATED
  if (isCheckingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#7a121d] animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">
            Verifying security session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#ede4d1] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#5e0c15] text-[#e6be58] mx-auto flex items-center justify-center border-2 border-[#c59b27] shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#5e0c15]">
              Administrator Sign In
            </h1>
            <p className="text-xs text-[#78716c]">
              Authorized Krishnanagar festival management portal.
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs leading-relaxed flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="name@domain.com"
                autoComplete="email"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#7a121d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#7a121d]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="btn-maroon-action w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
            >
              {isSubmittingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[#78716c]">
            <Link href="/" className="hover:text-[#7a121d] underline">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD MAIN VIEW
  const totalPandals = pandals.length;
  const verifiedPandals = pandals.filter((p) => p.is_verified).length;
  const publishedPandals = pandals.filter((p) => p.is_published).length;
  const pendingSubmissions = submissions.filter(
    (s) => s.status === "pending"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ede4d1] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#c59b27]" />
            <span>Authenticated Management Console</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#5e0c15]">
            Admin Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync to Supabase Cloud Button */}
          <button
            onClick={handleSyncToCloud}
            disabled={isSyncingToCloud}
            className="btn-gold-action px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Upload and synchronize all local pandals and coordinates directly to Supabase Cloud"
          >
            {isSyncingToCloud ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#1c1917]" />
            ) : (
              <Cloud className="w-4 h-4 text-[#1c1917]" />
            )}
            <span>
              {isSyncingToCloud
                ? "Syncing to Cloud..."
                : "Sync to Supabase Cloud"}
            </span>
          </button>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Status / Permission Guidance Banner */}
      {cloudSyncResult && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 animate-in fade-in ${
            cloudSyncResult.success
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : cloudSyncResult.is_permission_error
              ? "bg-amber-50 border-amber-300 text-amber-950"
              : "bg-rose-50 border-rose-300 text-rose-900"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {cloudSyncResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : cloudSyncResult.is_permission_error ? (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold text-sm block">
                  {cloudSyncResult.success
                    ? "Supabase Cloud Database Synchronized!"
                    : cloudSyncResult.is_permission_error
                    ? "Supabase Table Permission Setup Required"
                    : "Supabase Synchronization Notice"}
                </span>
                <p className="text-xs">{cloudSyncResult.message}</p>
                {cloudSyncResult.technical_details && (
                  <details className="mt-1.5 text-[11px] text-stone-500 cursor-pointer">
                    <summary className="hover:text-stone-700 font-medium text-[10px]">
                      View diagnostics details
                    </summary>
                    <p className="mt-1 font-mono text-[10px] bg-white/80 p-2 rounded-lg text-stone-700 break-all border border-stone-200">
                      {cloudSyncResult.technical_details}
                    </p>
                  </details>
                )}
              </div>
            </div>

            <button
              onClick={() => setCloudSyncResult(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* If Permission Error: Display 1-click SQL Command Box */}
          {cloudSyncResult.is_permission_error && cloudSyncResult.sql_fix && (
            <div className="mt-3 pt-3 border-t border-amber-200 space-y-2">
              <p className="text-[11px] font-semibold text-amber-900">
                To enable Supabase writes, paste the following SQL into your open Supabase SQL Editor tab and click Run:
              </p>
              <div className="relative bg-stone-900 text-amber-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                <pre>{cloudSyncResult.sql_fix}</pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(cloudSyncResult.sql_fix!);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2500);
                  }}
                  className="absolute right-2 top-2 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSql ? "Copied!" : "Copy SQL"}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSyncToCloud}
                  className="btn-maroon-action px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>I ran the SQL, Try Syncing Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ede4d1] shadow-xs">
          <span className="text-xs text-stone-500 font-semibold block">
            Total Pandals
          </span>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-[#5e0c15] mt-1 block">
            {totalPandals}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {publishedPandals} published
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d1] shadow-xs">
          <span className="text-xs text-stone-500 font-semibold block">
            GPS Verified
          </span>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700 mt-1 block">
            {verifiedPandals} / {totalPandals}
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {Math.round((verifiedPandals / (totalPandals || 1)) * 100)}% coverage
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d1] shadow-xs">
          <span className="text-xs text-stone-500 font-semibold block">
            Community Corrections
          </span>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-amber-600 mt-1 block">
            {pendingSubmissions}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            pending audit review
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d1] shadow-xs">
          <span className="text-xs text-stone-500 font-semibold block">
            Localities & Places
          </span>
          <span className="font-serif font-bold text-2xl sm:text-3xl text-stone-800 mt-1 block">
            {localities.length} / {places.length}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            sweet shops, parking, water
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ede4d1] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("pandals")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "pandals"
              ? "bg-[#5e0c15] text-[#fcfaf5]"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Pandals Directory ({pandals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "submissions"
              ? "bg-[#5e0c15] text-[#fcfaf5]"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Community Submissions ({pendingSubmissions})</span>
        </button>

        <button
          onClick={() => setActiveTab("places")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "places"
              ? "bg-[#5e0c15] text-[#fcfaf5]"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Food & Amenities ({places.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "announcements"
              ? "bg-[#5e0c15] text-[#fcfaf5]"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>
      </div>

      {/* 3. PANDALS MANAGEMENT TAB */}
      {activeTab === "pandals" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#1c1917]">
              Manage Krishnanagar Pandals
            </h2>
            <button
              onClick={() =>
                handleOpenPandalModal({
                  name: "",
                  name_bn: "",
                  address: "",
                  address_bn: "",
                  category: "traditional",
                  is_published: true,
                  is_verified: false,
                  latitude: null,
                  longitude: null,
                  cover_image_url:
                    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Burima%2C_Krishnanagar.jpg",
                })
              }
              className="btn-gold-action px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pandal</span>
            </button>
          </div>

          {/* Pandals Table */}
          <div className="bg-white rounded-2xl border border-[#ede4d1] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fcfaf5] border-b border-[#ede4d1] text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Pandal</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Locality</th>
                    <th className="p-4">Coordinates (GPS)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede4d1]">
                  {pandals.map((p) => {
                    const hasValidCoords =
                      typeof p.latitude === "number" &&
                      typeof p.longitude === "number" &&
                      isValidCoordinate(p.latitude, p.longitude);

                    return (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.cover_image_url}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-200 shrink-0"
                            />
                            <div>
                              <span className="font-serif font-bold text-stone-900 block">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-stone-500">
                                {p.name_bn}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-[10px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 text-stone-600 font-medium">
                          {p.locality?.name || "Krishnanagar"}
                        </td>
                        <td className="p-4">
                          {hasValidCoords ? (
                            <span className="font-mono text-[11px] text-stone-700">
                              {p.latitude?.toFixed(4)}, {p.longitude?.toFixed(4)}
                            </span>
                          ) : (
                            <span className="text-amber-700 font-medium italic text-[11px]">
                              No verified GPS
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {/* Verification Badge Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleVerify(p)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                p.is_verified
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                                  : "bg-amber-50 text-amber-800 border border-amber-300"
                              }`}
                              title="Click to toggle verified status"
                            >
                              {p.is_verified ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Verified</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  <span>Unverified</span>
                                </>
                              )}
                            </button>

                            {/* Publish Toggle */}
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(p)}
                              className={`p-1 rounded text-stone-500 hover:text-stone-800`}
                              title={
                                p.is_published
                                  ? "Published (Click to unpublish)"
                                  : "Unpublished (Click to publish)"
                              }
                            >
                              {p.is_published ? (
                                <Eye className="w-4 h-4 text-emerald-700" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-stone-400" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/pandals/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                              title="Preview Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleOpenPandalModal(p)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                              title="Edit Listing"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePandal(p.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBMISSIONS AUDIT QUEUE TAB */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#1c1917]">
              Community Correction Submissions Queue
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#ede4d1] shadow-xs overflow-hidden">
            {submissions.length === 0 ? (
              <p className="p-8 text-center text-xs text-stone-500">
                No submissions in queue.
              </p>
            ) : (
              <div className="divide-y divide-[#ede4d1]">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#1c1917]">
                          {sub.pandal_name || "General Correction"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          {sub.submission_type}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          sub.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : sub.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Status: {sub.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#57534e] bg-stone-50 p-3 rounded-xl border border-stone-200">
                      {sub.submitted_data.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>
                        Submitted by: {sub.submitted_data.reporter_name} (
                        {sub.submitted_data.reporter_contact || "No contact"})
                      </span>
                      <div className="flex items-center gap-2">
                        {sub.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateSubmission(sub.id, "approved")
                              }
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateSubmission(sub.id, "rejected")
                              }
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. FOOD & AMENITIES TAB */}
      {activeTab === "places" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#1c1917]">
              Food Stalls, Sweet Shops, Parking & First Aid
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white p-4 rounded-xl border border-[#ede4d1] space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a121d]">
                    {place.category}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">
                    GPS Verified
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1c1917]">
                  {place.name}
                </h4>
                <p className="text-xs text-[#57534e] line-clamp-2">
                  {place.description}
                </p>
                <div className="text-[11px] font-mono text-stone-500 pt-2 border-t border-stone-100">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ANNOUNCEMENTS TAB */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#1c1917]">
            Official Traffic Police Advisories & Schedules
          </h2>
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white p-5 rounded-xl border border-[#ede4d1] space-y-2 shadow-xs"
              >
                <h4 className="font-serif font-bold text-base text-[#5e0c15]">
                  {ann.title}
                </h4>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  {ann.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PANDAL EDIT / CREATE MODAL WITH INTERACTIVE MAP PICKER */}
      {editingPandal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#fcfaf5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c59b27]/40 relative my-8">
            <button
              onClick={() => setEditingPandal(null)}
              className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-[#ede4d1]"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSavePandal} className="space-y-5">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#5e0c15]">
                  {editingPandal.id ? "Edit Pandal Listing" : "Add New Pandal"}
                </h3>
                <p className="text-xs text-[#78716c] mt-0.5">
                  Ensure coordinates and timings adhere to authentic Krishnanagar verification standards.
                </p>
              </div>

              {/* English & Bengali Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pandal Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPandal.name || ""}
                    onChange={(e) =>
                      setEditingPandal({ ...editingPandal, name: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pandal Name (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPandal.name_bn || ""}
                    onChange={(e) =>
                      setEditingPandal({
                        ...editingPandal,
                        name_bn: e.target.value,
                      })
                    }
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              {/* Category & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingPandal.category || "traditional"}
                    onChange={(e) =>
                      setEditingPandal({
                        ...editingPandal,
                        category: e.target.value as PandalCategory,
                      })
                    }
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="heritage">Royal & Heritage</option>
                    <option value="traditional">Sabeki & Traditional</option>
                    <option value="theme">Art & Theme</option>
                    <option value="prominent">Major Landmark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Locality
                  </label>
                  <select
                    value={editingPandal.locality_id || ""}
                    onChange={(e) =>
                      setEditingPandal({
                        ...editingPandal,
                        locality_id: e.target.value || null,
                      })
                    }
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="">Select locality...</option>
                    {localities.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.name_bn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingPandal.description || ""}
                  onChange={(e) =>
                    setEditingPandal({
                      ...editingPandal,
                      description: e.target.value,
                    })
                  }
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-200 bg-white"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Verified Street Address
                </label>
                <input
                  type="text"
                  value={editingPandal.address || ""}
                  onChange={(e) =>
                    setEditingPandal({
                      ...editingPandal,
                      address: e.target.value,
                    })
                  }
                  placeholder="e.g. Chasapara Main Road, Krishnanagar"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-200 bg-white"
                />
              </div>

              {/* Thumbnail Picture & Gallery Management */}
              <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#ede4d1]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#7a121d]" />
                    <label className="block text-xs font-bold text-[#5e0c15]">
                      Pandal Thumbnail & Cover Photograph
                    </label>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Main card & banner picture
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Thumbnail Live Preview */}
                  <div className="relative w-full sm:w-44 aspect-16/10 sm:aspect-square rounded-xl overflow-hidden bg-stone-100 border-2 border-dashed border-[#ede4d1] shrink-0 group">
                    {editingPandal.cover_image_url ? (
                      <img
                        src={editingPandal.cover_image_url}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-stone-400">
                        <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      Active Thumbnail
                    </div>
                  </div>

                  {/* Input & Upload Controls */}
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Thumbnail Image URL
                      </label>
                      <input
                        type="url"
                        value={editingPandal.cover_image_url || ""}
                        onChange={(e) =>
                          setEditingPandal({
                            ...editingPandal,
                            cover_image_url: e.target.value,
                          })
                        }
                        placeholder="https://... or upload a photo from your computer below"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7a121d]"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Upload from device */}
                      <label className="btn-maroon-action px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
                        <Upload className="w-3.5 h-3.5 text-[#e6be58]" />
                        <span>Upload Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                      </label>

                      {editingPandal.cover_image_url && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingPandal({
                              ...editingPandal,
                              cover_image_url: "",
                            })
                          }
                          className="px-2.5 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-500 leading-tight">
                      Supported: JPG, PNG, WebP or direct image links. Selecting a file loads and saves the image directly.
                    </p>
                  </div>
                </div>

                {/* Additional Gallery Photos Section */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-stone-700">
                      Additional Gallery Images ({editingPandal.gallery?.length || 0})
                    </label>

                    {/* Upload into Gallery */}
                    <label className="text-xs font-semibold text-[#7a121d] hover:underline flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo to Gallery</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddGalleryPhoto}
                      />
                    </label>
                  </div>

                  {editingPandal.gallery && editingPandal.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {editingPandal.gallery.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-100"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(idx)}
                              className="self-end p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetAsThumbnail(img)}
                              className="w-full py-1 text-[10px] font-bold rounded bg-[#c59b27] text-[#1c1917] hover:bg-[#e6be58] text-center"
                            >
                              Set as Cover
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic">
                      No extra gallery pictures. Click "Add Photo to Gallery" to upload more photos.
                    </p>
                  )}
                </div>
              </div>

              {/* Address Search & Interactive Map Pinning */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#ede4d1]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#7a121d]" />
                    <label className="block text-xs font-bold text-[#5e0c15]">
                      Location & Map Placement (Google Maps Address Search)
                    </label>
                  </div>
                  {typeof editingPandal.latitude === "number" &&
                    typeof editingPandal.longitude === "number" &&
                    !isKrishnanagarVicinity(
                      editingPandal.latitude,
                      editingPandal.longitude
                    ) && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-semibold">
                        Notice: Coordinates appear outside Krishnanagar bounds!
                      </span>
                    )}
                </div>

                {/* Google Maps Realtime Autocomplete Address Search Bar */}
                <div className="space-y-2">
                  <GoogleMapsAddressSearch
                    value={addressSearchQuery}
                    onChange={(val) => setAddressSearchQuery(val)}
                    onSelectLocation={handleSelectLocation}
                    selectedCoordinates={
                      editingPandal.latitude && editingPandal.longitude
                        ? {
                            latitude: editingPandal.latitude,
                            longitude: editingPandal.longitude,
                          }
                        : null
                    }
                  />

                  {/* Quick Landmark Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[11px] text-stone-500 font-semibold">
                      Popular:
                    </span>
                    {Object.values(KNOWN_KRISHNANAGAR_LOCATIONS)
                      .slice(0, 8)
                      .map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => handleSelectLocation(loc)}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 hover:bg-[#7a121d] hover:text-white text-stone-700 transition-colors cursor-pointer border border-stone-200"
                        >
                          📍 {loc.title.split(" ")[0]}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Leaflet Coordinate Picker */}
                <AdminMapPicker
                  latitude={editingPandal.latitude ?? null}
                  longitude={editingPandal.longitude ?? null}
                  onChange={(lat, lng) =>
                    setEditingPandal({
                      ...editingPandal,
                      latitude: lat,
                      longitude: lng,
                      is_verified: true,
                      verified_at: new Date().toISOString(),
                    })
                  }
                />

                {/* Prominent Latitude & Longitude Feature Section */}
                <div className="p-4 bg-[#fcfaf5] rounded-xl border border-[#ede4d1] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#7a121d]" />
                      <span className="text-xs font-bold text-[#5e0c15]">
                        GPS Coordinates (Latitude & Longitude)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLocateCurrentPosition}
                        className="text-[11px] font-semibold text-[#7a121d] hover:bg-[#7a121d]/10 px-2.5 py-1 rounded-lg border border-[#7a121d]/30 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Detect and use your current GPS location"
                      >
                        <Navigation className="w-3 h-3 text-[#7a121d]" />
                        <span>Use My Location</span>
                      </button>

                      {editingPandal.latitude && editingPandal.longitude && (
                        <button
                          type="button"
                          onClick={handleCopyCoordinates}
                          className="text-[11px] font-semibold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title="Copy coordinates to clipboard"
                        >
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>Copy GPS</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-stone-700">
                          Latitude
                        </label>
                        <span className="text-[10px] text-stone-400">
                          e.g. 23.407200
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.000001"
                        value={editingPandal.latitude ?? ""}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value);
                          setEditingPandal({
                            ...editingPandal,
                            latitude: val,
                            is_verified:
                              val !== null && editingPandal.longitude !== null,
                            verified_at: new Date().toISOString(),
                          });
                        }}
                        placeholder="23.407200"
                        className="w-full text-xs font-mono font-medium px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#7a121d]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-stone-700">
                          Longitude
                        </label>
                        <span className="text-[10px] text-stone-400">
                          e.g. 88.502800
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.000001"
                        value={editingPandal.longitude ?? ""}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value);
                          setEditingPandal({
                            ...editingPandal,
                            longitude: val,
                            is_verified:
                              editingPandal.latitude !== null && val !== null,
                            verified_at: new Date().toISOString(),
                          });
                        }}
                        placeholder="88.502800"
                        className="w-full text-xs font-mono font-medium px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#7a121d]"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-[#ede4d1]/60">
                    <div>
                      {editingPandal.latitude && editingPandal.longitude ? (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pin placed: {editingPandal.latitude.toFixed(6)},{" "}
                          {editingPandal.longitude.toFixed(6)}
                        </span>
                      ) : (
                        <span className="text-amber-700 italic">
                          No GPS point placed yet. Click on the map, search
                          address, or type coordinates.
                        </span>
                      )}
                    </div>
                    <span className="text-stone-400">
                      Coordinates stay in 2-way sync with map pin
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkboxes: Verified, Featured, Published */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPandal.is_verified || false}
                    onChange={(e) =>
                      setEditingPandal({
                        ...editingPandal,
                        is_verified: e.target.checked,
                        verified_at: e.target.checked
                          ? new Date().toISOString()
                          : null,
                      })
                    }
                    className="rounded text-[#7a121d]"
                  />
                  <span>Mark as GPS Verified</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPandal.is_featured || false}
                    onChange={(e) =>
                      setEditingPandal({
                        ...editingPandal,
                        is_featured: e.target.checked,
                      })
                    }
                    className="rounded text-[#7a121d]"
                  />
                  <span>Featured Landmark</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPandal.is_published ?? true}
                    onChange={(e) =>
                      setEditingPandal({
                        ...editingPandal,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded text-[#7a121d]"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#ede4d1]">
                <button
                  type="button"
                  onClick={() => setEditingPandal(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-maroon-action px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pandal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

