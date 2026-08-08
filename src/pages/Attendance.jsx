import { useEffect, useRef, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import StatusStamp from "../components/StatusStamp";

// NOTE: Photo storage is temporarily disabled because Firebase Storage
// requires the Blaze (pay-as-you-go) plan. The camera step still runs as a
// presence check, but the captured image is not uploaded anywhere — only
// timestamp + location are saved. To re-enable photo storage:
// 1. Upgrade your Firebase project to the Blaze plan
// 2. In Firebase console: Storage -> Get started -> Done
// 3. Restore the storage import/upload block (see project history)

// If your school has fixed coordinates, set them here to flag check-ins
// that happen far from campus (a simple geofence).
const SCHOOL_COORDS = null; // e.g. { lat: 28.6139, lng: 77.2090 }
const GEOFENCE_METERS = 200;

function distanceMeters(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export default function Attendance() {
  const { user, profile } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [photo, setPhoto] = useState(null); // data URL
  const [location, setLocation] = useState(null); // { lat, lng, accuracy }
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | ok | error
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | done | error
  const [error, setError] = useState("");

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch (err) {
      setError("Couldn't access the camera. Check browser permissions.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg", 0.85));
  }

  function retake() {
    setPhoto(null);
  }

  function fetchLocation() {
    setLocStatus("loading");
    setError("");
    if (!navigator.geolocation) {
      setLocStatus("error");
      setError("Geolocation isn't supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocStatus("ok");
      },
      () => {
        setLocStatus("error");
        setError("Couldn't get your location. Check location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const withinGeofence =
    SCHOOL_COORDS && location
      ? distanceMeters(SCHOOL_COORDS, location) <= GEOFENCE_METERS
      : null;

  async function submitCheckIn() {
    if (!photo || !location || !user) return;
    setSaveStatus("saving");
    setError("");
    try {
      // Photo upload is skipped for now (needs Firebase Blaze plan).
      // The photo is only used locally as a presence check and isn't saved.

      // Write attendance record to Firestore
      await addDoc(collection(db, "attendance"), {
        userId: user.uid,
        name: profile?.name || user.email,
        role: profile?.role || "unknown",
        photoConfirmed: true,
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy,
        withinGeofence,
        timestamp: serverTimestamp(),
      });

      setSaveStatus("done");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setError("Couldn't save attendance. Check your Firebase setup in src/firebase.js.");
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-gy-ink">Check in</h1>
        <StatusStamp status={saveStatus === "done" ? "present" : "pending"}>
          {saveStatus === "done" ? "Recorded" : "Not yet checked in"}
        </StatusStamp>
      </div>
      <p className="text-sm text-gy-ink/60 mb-6">
        Take a photo and share your location to mark attendance.
      </p>

      {error && (
        <p className="text-sm text-gy-coral bg-gy-coral/10 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {/* Camera / photo preview */}
      <div className="badge-card p-4 mb-4">
        <div className="relative bg-gy-ink rounded-lg overflow-hidden aspect-[4/3]">
          {!photo && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          {photo && <img src={photo} alt="Captured" className="w-full h-full object-cover" />}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mt-4 flex gap-3">
          {!photo ? (
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="flex-1 bg-gy-ink text-white rounded py-2.5 text-sm font-medium hover:bg-gy-inkDeep disabled:opacity-50"
            >
              Capture photo
            </button>
          ) : (
            <button
              onClick={retake}
              className="flex-1 border border-gy-line rounded py-2.5 text-sm font-medium hover:bg-gy-cream"
            >
              Retake
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="badge-card p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gy-ink">Location</p>
            {location ? (
              <p className="text-xs font-mono text-gy-ink/60 mt-1">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)} · ±
                {Math.round(location.accuracy)}m
                {SCHOOL_COORDS && (
                  <span className={withinGeofence ? "text-gy-teal" : "text-gy-coral"}>
                    {" "}
                    · {withinGeofence ? "on campus" : "off campus"}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-xs text-gy-ink/40 mt-1">Not shared yet</p>
            )}
          </div>
          <button
            onClick={fetchLocation}
            className="text-sm font-medium text-gy-gold hover:underline"
          >
            {locStatus === "loading" ? "Locating…" : location ? "Refresh" : "Share location"}
          </button>
        </div>
      </div>

      <button
        onClick={submitCheckIn}
        disabled={!photo || !location || saveStatus === "saving" || saveStatus === "done"}
        className="w-full bg-gy-teal text-white rounded py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40"
      >
        {saveStatus === "saving"
          ? "Saving…"
          : saveStatus === "done"
          ? "Checked in ✓"
          : "Submit attendance"}
      </button>
    </div>
  );
}
