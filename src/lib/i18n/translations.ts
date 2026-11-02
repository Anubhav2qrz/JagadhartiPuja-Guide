import { Language } from "@/types";

export interface Translations {
  appName: string;
  tagline: string;
  locationLabel: string;
  nav: {
    home: string;
    explore: string;
    map: string;
    route: string;
    essentials: string;
    about: string;
    admin: string;
    myRoute: string;
    favourites: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    planRouteBtn: string;
    useLocationBtn: string;
    locating: string;
    locationDenied: string;
  };
  actions: {
    navigateGoogleMaps: string;
    viewDetails: string;
    addToRoute: string;
    removeFromRoute: string;
    inRoute: string;
    saveFavorite: string;
    saved: string;
    share: string;
    copied: string;
    viewOnMap: string;
    reportCorrection: string;
    filter: string;
    clearFilters: string;
    search: string;
    locateMe: string;
    resetView: string;
  };
  categories: {
    all: string;
    heritage: string;
    traditional: string;
    theme: string;
    prominent: string;
  };
  essentialsCategories: {
    all: string;
    sweet_shop: string;
    food_stall: string;
    restaurant: string;
    parking: string;
    restroom: string;
    water: string;
    first_aid: string;
  };
  status: {
    verified: string;
    verifiedCoords: string;
    unverified: string;
    unverifiedNotice: string;
    lastVerified: string;
    darshanTimings: string;
    accessibility: string;
    wheelchairYes: string;
    wheelchairNo: string;
    rampYes: string;
  };
  routePlanner: {
    title: string;
    subtitle: string;
    startPoint: string;
    currentLocation: string;
    chooseStart: string;
    selectedStops: string;
    noStops: string;
    noStopsDesc: string;
    browsePandals: string;
    travelMode: string;
    walking: string;
    driving: string;
    openInGoogleMaps: string;
    openSegment: string;
    segmentNotice: string;
    clearRoute: string;
    shareRoute: string;
    moveUp: string;
    moveDown: string;
    remove: string;
    stopsCount: string;
    approxDistance: string;
    totalStops: string;
  };
  filters: {
    searchPlaceholder: string;
    allLocalities: string;
    sortBy: string;
    sortFeatured: string;
    sortName: string;
    sortLocality: string;
    verifiedOnly: string;
    wheelchairOnly: string;
  };
  discovery: {
    featuredTitle: string;
    featuredSubtitle: string;
    heritageTitle: string;
    heritageSubtitle: string;
    themesTitle: string;
    themesSubtitle: string;
    mapPreviewTitle: string;
    mapPreviewSubtitle: string;
    routePromoTitle: string;
    routePromoSubtitle: string;
    viewFullMap: string;
    planItinerary: string;
    advisoriesTitle: string;
    advisoriesSubtitle: string;
  };
  empty: {
    noPandals: string;
    noPandalsDesc: string;
    noPlaces: string;
    noPlacesDesc: string;
  };
  correctionModal: {
    title: string;
    subtitle: string;
    pandalLabel: string;
    typeLabel: string;
    nameLabel: string;
    contactLabel: string;
    notesLabel: string;
    submitBtn: string;
    submitting: string;
    success: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Jagadhatri Darshan",
    tagline: "Discover Krishnanagar, One Pandal at a Time.",
    locationLabel: "Krishnanagar, Nadia, West Bengal",
    nav: {
      home: "Home",
      explore: "Explore Pandals",
      map: "Interactive Map",
      route: "Plan Your Route",
      essentials: "Food & Essentials",
      about: "About",
      admin: "Admin",
      myRoute: "My Route",
      favourites: "Favourites",
    },
    hero: {
      badge: "Krishnanagar Jagadhatri Puja 2026",
      title: "Discover Krishnanagar, One Pandal at a Time",
      subtitle:
        "The complete, verified guide to historic Jagadhatri Puja pandals, sacred idols, royal heritage, food stalls, and turn-by-turn Google Maps navigation.",
      exploreBtn: "Explore Pandals",
      planRouteBtn: "Plan Your Route",
      useLocationBtn: "Near My Location",
      locating: "Finding location...",
      locationDenied: "Location permission denied. Showing all pandals.",
    },
    actions: {
      navigateGoogleMaps: "Navigate with Google Maps",
      viewDetails: "View Details",
      addToRoute: "Add to Route",
      removeFromRoute: "Remove",
      inRoute: "In Route",
      saveFavorite: "Favourite",
      saved: "Saved",
      share: "Share",
      copied: "Link copied to clipboard!",
      viewOnMap: "View on Map",
      reportCorrection: "Submit Correction",
      filter: "Filter",
      clearFilters: "Clear Filters",
      search: "Search",
      locateMe: "Locate Me",
      resetView: "Reset Map",
    },
    categories: {
      all: "All Categories",
      heritage: "Royal & Heritage",
      traditional: "Sabeki & Traditional",
      theme: "Art & Theme",
      prominent: "Iconic & Major",
    },
    essentialsCategories: {
      all: "All Facilities",
      sweet_shop: "Sweet Shops (Sarpuria)",
      food_stall: "Food & Refreshments",
      restaurant: "Restaurants",
      parking: "Festival Parking",
      restroom: "Restrooms & Toilets",
      water: "Drinking Water",
      first_aid: "Medical & First Aid",
    },
    status: {
      verified: "Verified Listing",
      verifiedCoords: "GPS Verified",
      unverified: "Verification Pending",
      unverifiedNotice:
        "Destination coordinates are awaiting field verification. Navigation is disabled until confirmed.",
      lastVerified: "Verified on",
      darshanTimings: "Darshan Timings",
      accessibility: "Accessibility",
      wheelchairYes: "Wheelchair Accessible",
      wheelchairNo: "No Wheelchair Ramp",
      rampYes: "Ramp Available",
    },
    routePlanner: {
      title: "Pandal Hopping Route Planner",
      subtitle:
        "Select your must-see pandals, order stops to optimize your walk, and launch directly in Google Maps.",
      startPoint: "Starting Point",
      currentLocation: "My Current Location",
      chooseStart: "Custom start or pandal...",
      selectedStops: "Your Hopping Itinerary",
      noStops: "No pandals added yet",
      noStopsDesc:
        "Browse the pandal directory or map to add stops to your hopping route.",
      browsePandals: "Browse Pandals",
      travelMode: "Travel Mode",
      walking: "Walking",
      driving: "Driving / Toto",
      openInGoogleMaps: "Open Full Route in Google Maps",
      openSegment: "Open Segment",
      segmentNotice:
        "Google Maps supports up to 10 stops per navigation link. Your route has been organized into seamless travel segments below.",
      clearRoute: "Clear Route",
      shareRoute: "Share Route",
      moveUp: "Move Up",
      moveDown: "Move Down",
      remove: "Remove",
      stopsCount: "stops selected",
      approxDistance: "Approx. straight-line distance",
      totalStops: "Total Stops",
    },
    filters: {
      searchPlaceholder: "Search by pandal name, locality or keyword...",
      allLocalities: "All Localities",
      sortBy: "Sort by",
      sortFeatured: "Featured First",
      sortName: "Name (A to Z)",
      sortLocality: "Locality",
      verifiedOnly: "Verified Only",
      wheelchairOnly: "Wheelchair Friendly",
    },
    discovery: {
      featuredTitle: "Featured Pandals",
      featuredSubtitle:
        "The most revered and celebrated Jagadhatri Puja landmarks in Krishnanagar.",
      heritageTitle: "Royal & Heritage Pujas",
      heritageSubtitle:
        "Centuries of history tracing back to Maharaja Krishna Chandra Roy.",
      themesTitle: "Art & Theme Highlights",
      themesSubtitle: "Stunning pandal architecture and imaginative lighting.",
      mapPreviewTitle: "Interactive Krishnanagar Map",
      mapPreviewSubtitle:
        "Browse all pandals with accurate GPS coordinates and live orientation.",
      routePromoTitle: "Plan Multi-Stop Hopping",
      routePromoSubtitle:
        "Don't wander aimlessly. Build a custom hopping itinerary and open turn-by-turn walking directions in Google Maps.",
      viewFullMap: "Open Full Interactive Map",
      planItinerary: "Plan Your Route",
      advisoriesTitle: "Official Advisories & Timings",
      advisoriesSubtitle:
        "Traffic guidelines, immersion schedules, and verified safety announcements.",
    },
    empty: {
      noPandals: "No pandals found",
      noPandalsDesc:
        "No listings match your search or filter criteria. Try resetting your filters.",
      noPlaces: "No places found",
      noPlacesDesc: "Try selecting another category or clearing your search.",
    },
    correctionModal: {
      title: "Submit a Correction or Pandal Information",
      subtitle:
        "Help keep Krishnanagar Jagadhatri Darshan accurate for all devotees and visitors.",
      pandalLabel: "Pandal Name (Optional if reporting general)",
      typeLabel: "Information Type",
      nameLabel: "Your Name",
      contactLabel: "Contact Phone / Email",
      notesLabel: "Detailed Correction or Timings Update",
      submitBtn: "Send Update",
      submitting: "Submitting...",
      success: "Thank you! Your submission has been received for editorial review.",
      close: "Close",
    },
  },
  bn: {
    appName: "জগদ্ধাত্রী দর্শন",
    tagline: "আবিষ্কার করুন কৃষ্ণনগর, একের পর এক মণ্ডপ।",
    locationLabel: "কৃষ্ণনগর, নদিয়া, পশ্চিমবঙ্গ",
    nav: {
      home: "হোম",
      explore: "মণ্ডপ পরিক্রমা",
      map: "ইন্টারেক্টিভ ম্যাপ",
      route: "রুট প্ল্যানার",
      essentials: "খাবার ও জরুরি তথ্য",
      about: "ইতিহাস ও পরিচয়",
      admin: "অ্যাডমিন",
      myRoute: "আমার রুট",
      favourites: "পছন্দের তালিকা",
    },
    hero: {
      badge: "কৃষ্ণনগর জগদ্ধাত্রী পূজা ২০২৬",
      title: "আবিষ্কার করুন কৃষ্ণনগর, একের পর এক মণ্ডপ",
      subtitle:
        "ঐতিহাসিক জগদ্ধাত্রী পূজার পুণ্য দর্শন, রাজবাড়ির ঐতিহ্য, চাষাপাড়া বুড়িমা, খাঁটি সরপুরিয়া এবং গুগল ম্যাপস সরাসরি নেভিগেশনের একমাত্র সম্পূর্ণ গাইড।",
      exploreBtn: "মণ্ডপ তালিকা দেখুন",
      planRouteBtn: "রুট তৈরি করুন",
      useLocationBtn: "নিকটবর্তী মণ্ডপ",
      locating: "অবস্থান খোঁজা হচ্ছে...",
      locationDenied: "লোকেশন অনুমতি পাওয়া যায়নি। সব মণ্ডপ দেখানো হচ্ছে।",
    },
    actions: {
      navigateGoogleMaps: "গুগল ম্যাপে যান",
      viewDetails: "বিস্তারিত দেখুন",
      addToRoute: "রুটে যোগ করুন",
      removeFromRoute: "বাদ দিন",
      inRoute: "রুটে আছে",
      saveFavorite: "পছন্দ",
      saved: "সংরক্ষিত",
      share: "শেয়ার করুন",
      copied: "লিংক কপি করা হয়েছে!",
      viewOnMap: "ম্যাপে দেখুন",
      reportCorrection: "সংশোধন পাঠান",
      filter: "ফিল্টার",
      clearFilters: "সব ফিল্টার মুছুন",
      search: "অনুসন্ধান",
      locateMe: "আমার অবস্থান",
      resetView: "ম্যাপ রিসেট",
    },
    categories: {
      all: "সব ক্যাটাগরি",
      heritage: "রাজকীয় ও ঐতিহ্যবাহী",
      traditional: "সাবেকি বারোয়ারী",
      theme: "শিল্প ও থিম",
      prominent: "প্রধান ও সুবিখ্যাত",
    },
    essentialsCategories: {
      all: "সকল সুবিধা",
      sweet_shop: "মিষ্টির দোকান (সরপুরিয়া)",
      food_stall: "খাবার ও রিফ্রেশমেন্ট",
      restaurant: "রেস্তোরাঁ",
      parking: "পূজা পার্কিং",
      restroom: "শৌচাগার",
      water: "বিশুদ্ধ পানীয় জল",
      first_aid: "চিকিৎসা ও ফার্স্ট এইড",
    },
    status: {
      verified: "যাচাইকৃত তথ্য",
      verifiedCoords: "জিপিএস অবস্থান যাচাইকৃত",
      unverified: "যাচাই প্রক্রিয়াধীন",
      unverifiedNotice:
        "এই গন্তব্যের অবস্থান মাঠপর্যায়ে নিশ্চিত করা হচ্ছে। যাচাই না হওয়া পর্যন্ত নেভিগেশন স্থগিত রাখা হয়েছে।",
      lastVerified: "যাচাইয়ের তারিখ",
      darshanTimings: "দর্শনের সময়সূচি",
      accessibility: "প্রবেশগম্যতা",
      wheelchairYes: "হুইলচেয়ার সুবিধাযুক্ত",
      wheelchairNo: "হুইলচেয়ার র‍্যাম্প নেই",
      rampYes: "র‍্যাম্প আছে",
    },
    routePlanner: {
      title: "মণ্ডপ পরিক্রমা রুট প্ল্যানার",
      subtitle:
        "আপনার পছন্দের মণ্ডপগুলো বেছে নিন, ক্রম সাজান এবং সরাসরি গুগল ম্যাপসে এক ক্লিকে নেভিগেশন চালু করুন।",
      startPoint: "শুরুর স্থান",
      currentLocation: "আমার বর্তমান অবস্থান",
      chooseStart: "কাস্টম শুরুর স্থান...",
      selectedStops: "পরিক্রমার নির্বাচিত মণ্ডপ",
      noStops: "এখনো কোনো মণ্ডপ যুক্ত করা হয়নি",
      noStopsDesc:
        "মণ্ডপ তালিকা বা ম্যাপ থেকে মণ্ডপ যোগ করে আপনার পরিক্রমা সূচি তৈরি করুন।",
      browsePandals: "মণ্ডপ সন্ধান করুন",
      travelMode: "ভ্রমণের মাধ্যম",
      walking: "পায়ে হেঁটে",
      driving: "টোটো / গাড়ি",
      openInGoogleMaps: "গুগল ম্যাপে পুরো রুট খুলুন",
      openSegment: "সেগমেন্ট খুলুন",
      segmentNotice:
        "গুগল ম্যাপসে একসাথে সর্বোচ্চ ১০টি স্টপ সাপোর্ট করে। আপনার সুবিধার্থে রুটটি নিচে একাধিক সেগমেন্টে বিভক্ত করা হয়েছে।",
      clearRoute: "রুট মুছুন",
      shareRoute: "রুট শেয়ার করুন",
      moveUp: "উপরে নিন",
      moveDown: "নিচে নিন",
      remove: "সরিয়ে দিন",
      stopsCount: "টি মণ্ডপ নির্বাচিত",
      approxDistance: "আনুমানিক সরলরেখা দূরত্ব",
      totalStops: "মোট স্টপ",
    },
    filters: {
      searchPlaceholder: "মণ্ডপের নাম, এলাকা বা কিওয়ার্ড দিয়ে খুঁজুন...",
      allLocalities: "সব এলাকা",
      sortBy: "সাজান",
      sortFeatured: "প্রধান মণ্ডপ আগে",
      sortName: "নাম (অ-ক্ষর অনুযায়ী)",
      sortLocality: "এলাকা অনুযায়ী",
      verifiedOnly: "শুধুমাত্র যাচাইকৃত",
      wheelchairOnly: "হুইলচেয়ার উপযোগী",
    },
    discovery: {
      featuredTitle: "প্রধান ও বিশিষ্ট মণ্ডপ",
      featuredSubtitle: "কৃষ্ণনগর জগদ্ধাত্রী পূজার সবচেয়ে বিখ্যাত ও জাগ্রত দেবীর স্থান।",
      heritageTitle: "ঐতিহাসিক ও রাজকীয় পূজা",
      heritageSubtitle: "মহারাজা কৃষ্ণচন্দ্র রায়ের আমল থেকে চলে আসা শতাব্দীর ইতিহাস।",
      themesTitle: "শিল্প ও থিম আকর্ষণ",
      themesSubtitle: "মনোমুগ্ধকর মণ্ডপসজ্জা ও চন্দননগরের আলোয় উদ্ভাসিত রূপ।",
      mapPreviewTitle: "ইন্টারেক্টিভ কৃষ্ণনগর ম্যাপ",
      mapPreviewSubtitle: "সঠিক জিপিএস অবস্থান দেখে শহরের প্রতিটি মণ্ডপ ঘুরে দেখুন।",
      routePromoTitle: "একাধিক মণ্ডপ পরিক্রমা পরিকল্পনা",
      routePromoSubtitle:
        "পথ না হারিয়ে একাধিক মণ্ডপ সাজিয়ে গুগল ম্যাপসে এক ক্লিকে সেরা পথ খুঁজুন।",
      viewFullMap: "সম্পূর্ণ ম্যাপ খুলুন",
      planItinerary: "রুট তৈরি করুন",
      advisoriesTitle: "প্রশাসনিক নির্দেশিকা ও সময়সূচি",
      advisoriesSubtitle: "ট্রাফিক নিয়ম, নিরঞ্জন শোভাযাত্রার সময় ও গুরুত্বপূর্ণ সতর্কতা।",
    },
    empty: {
      noPandals: "কোনো মণ্ডপ পাওয়া যায়নি",
      noPandalsDesc: "আপনার অনুসন্ধান অনুযায়ী কোনো মণ্ডপ মেলেনি। ফিল্টার রিসেট করে দেখুন।",
      noPlaces: "কোনো তথ্য পাওয়া যায়নি",
      noPlacesDesc: "অন্য ক্যাটাগরি বেছে নিন বা অনুসন্ধান পরিবর্তন করুন।",
    },
    correctionModal: {
      title: "সংশোধন পাঠান বা মণ্ডপের তথ্য দিন",
      subtitle: "সকল ভক্ত ও দর্শনার্থীর সুবিধার্থে সঠিক তথ্য দিতে সাহায্য করুন।",
      pandalLabel: "মণ্ডপের নাম (প্রযোজ্য ক্ষেত্রে)",
      typeLabel: "তথ্যের ধরন",
      nameLabel: "আপনার নাম",
      contactLabel: "মোবাইল বা ইমেইল",
      notesLabel: "সঠিক তথ্য বা সময়সূচি",
      submitBtn: "জমা দিন",
      submitting: "পাঠানো হচ্ছে...",
      success: "ধন্যবাদ! আপনার পাঠানো তথ্য পর্যালোচনার জন্য জমা হয়েছে।",
      close: "বন্ধ করুন",
    },
  },
};

