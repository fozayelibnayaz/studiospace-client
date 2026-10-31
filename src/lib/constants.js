export const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

export const CATEGORY_META = {
  "Photo Studio": {
    blurb: "Cyc walls, soft light & tabletop rigs",
  },
  "Film Stage": {
    blurb: "Blacked-out soundstages & green screen bays",
  },
  "Podcast Lounge": {
    blurb: "Treated rooms with broadcast chains",
  },
  "Music Suite": {
    blurb: "Rehearsal, tracking & mixing rooms",
  },
  "Art Workshop": {
    blurb: "Bright benches, easels & printing bays",
  },
};

export const AMENITY_OPTIONS = [
  "Cyc Wall",
  "Green Screen",
  "4K Cameras",
  "Lighting Kit",
  "Soundproof",
  "Mixer",
  "Wi-Fi",
  "Parking",
  "Makeup Room",
  "Air Conditioning",
];

export const BOOKING_STATUS_STYLES = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export const serverBaseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001").replace(/\/+$/, "");
