import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy-project-id") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === "";

// Rich Seed Data for Mock Client
const MOCK_EVENT_PACKAGES = [
  {
    id: "pack-silver",
    business_unit_id: "bu1",
    name: "Silver Celebration Package",
    hall_name: "Lounge & Terrace (Hall B)",
    capacity: 120,
    price_from: 750000,
    description: "Perfect for intimate gatherings, bridal showers, birthdays, and private corporate dinners. Offers access to the indoor lounge and open-air garden terrace.",
    inclusions: [
      "5 Hours Event Duration",
      "Standard Ambient & Stage Lighting",
      "Lounge Furniture & High Tables",
      "Dedicated Venue Supervisor",
      "Full Air Conditioning",
      "Backup Power Generator Standby"
    ],
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    display_order: 1,
    is_active: true
  },
  {
    id: "pack-gold",
    business_unit_id: "bu1",
    name: "Gold Royale Package",
    hall_name: "Grand Banquet Hall (Hall A)",
    capacity: 400,
    price_from: 1800000,
    description: "Our signature package tailored for weddings, corporate gala dinners, award nights, and major celebrations. Includes banquet setup and full amenities.",
    inclusions: [
      "8 Hours Event Duration",
      "Full Stage Setup & Trussing",
      "Premium Sound & Lighting Console",
      "Round Banquet Tables & Premium Chairs",
      "VIP Green Rooms / Changing Suites",
      "Professional In-House Security",
      "Dedicated Car Park (100+ slots)",
      "Uninterrupted Power Supply"
    ],
    image_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200",
    display_order: 2,
    is_active: true
  },
  {
    id: "pack-platinum",
    business_unit_id: "bu1",
    name: "Platinum Elite Package",
    hall_name: "Unified Grand Pavilion (Full Venue)",
    capacity: 800,
    price_from: 3200000,
    description: "The ultimate luxury event experience featuring full venue takeover. Combines the Grand Ballroom, Garden Terrace, and Outdoor Pavilions for large-scale concerts, festivals, or elite societal weddings.",
    inclusions: [
      "12 Hours Full Day Access",
      "Full Venue Takeover (Indoor & Outdoor)",
      "Concert-Grade Sound & Intelligent Lighting",
      "Customizable VIP Holding Lounges",
      "Dedicated Event Coordinator Team",
      "Armed Security Escorts & Traffic Controllers",
      "Valet Parking Service",
      "Unlimited High-Speed Wi-Fi",
      "Premium Janitorial Staff Site-wide"
    ],
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    display_order: 3,
    is_active: true
  }
];

const MOCK_EVENT_TERMS = [
  {
    id: "term-1",
    business_unit_id: "bu1",
    title: "Booking & Deposit Policy",
    content: "A non-refundable commitment deposit of 50% of the total quote is required to secure the hall booking date. The remaining 50% balance must be fully paid and cleared at least 14 working days prior to the event date. Bookings made within 14 days of the event must be paid in full at the time of reservation.",
    display_order: 1
  },
  {
    id: "term-2",
    business_unit_id: "bu1",
    title: "Cancellation & Rescheduling",
    content: "Cancellations made 30 days or more prior to the event will forfeit the initial 50% deposit. Cancellations within 14 days will forfeit 100% of the contract value. Rescheduling is allowed once, free of charge, if requested at least 45 days prior, subject to hall availability. Any subsequent rescheduling attracts a fee of NGN 150,000.",
    display_order: 2
  },
  {
    id: "term-3",
    business_unit_id: "bu1",
    title: "Decor & External Vendors",
    content: "To maintain our premium facility standards, only certified event decorators and caterers are permitted to operate on-site. External vendors must register with the venue management and sign the Vendor Code of Conduct. Noise thresholds must comply with Lagos State Environmental Protection Agency (LASEPA) limits.",
    display_order: 3
  },
  {
    id: "term-4",
    business_unit_id: "bu1",
    title: "Caution Deposit & Damages",
    content: "A refundable Caution Deposit of NGN 150,000 is required for all bookings. This deposit serves as security for any damages to the facility, fixtures, or sound/lighting systems. Post-event inspections are conducted jointly, and the deposit is refunded within 5 business days if no damages or policy infractions are recorded.",
    display_order: 4
  }
];

const MOCK_MENU_ITEMS = [
  {
    id: "menu-1",
    business_unit_id: "bu2",
    name: "Signature Smokey Jollof Rice",
    price: 4500,
    category: "Mains",
    description: "Rich, fire-wood infused smokey jollof rice served with sweet sweet plantains, side salad, and your choice of flame-grilled peppered chicken or beef.",
    dietary_tags: ["Spicy", "Chef Special"],
    is_featured: true,
    display_order: 1,
    image_url: "https://images.unsplash.com/photo-1626776876729-bab4e27f5195?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "menu-2",
    business_unit_id: "bu2",
    name: "REOL Royal Grill Platter",
    price: 12500,
    category: "Specials",
    description: "A decadent combination of grilled giant tiger prawns, spicy suya beef strips, chicken wings, sweet potato wedges, corn on the cob, and house garlic dip.",
    dietary_tags: ["Gluten-Free", "High-Protein"],
    is_featured: true,
    display_order: 2,
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "menu-3",
    business_unit_id: "bu2",
    name: "Fiery Peppered Gizzard & Plantain",
    price: 3800,
    category: "Starters",
    description: "Crispy fried sweet plantains (dodo) tossed with tender, spiced chicken gizzard in a hot, chunky bell pepper and habanero reduction.",
    dietary_tags: ["Very Spicy"],
    is_featured: false,
    display_order: 3,
    image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "menu-4",
    business_unit_id: "bu2",
    name: "Traditional Efo Riro with Assorted Meat",
    price: 6500,
    category: "Mains",
    description: "Rich, authentic Yoruba spinach stew prepared with locust beans (iru), shaki, beef, ponmo, dry fish, and served with fluffy pounded yam or semovita.",
    dietary_tags: ["Traditional"],
    is_featured: false,
    display_order: 4,
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "menu-5",
    business_unit_id: "bu2",
    name: "Tropical Zobo Infusion Cooler",
    price: 1800,
    category: "Drinks",
    description: "Slow-brewed red hibiscus flower infusion, sweetened with organic pineapple juice, spiced with root ginger, cloves, and garnished with fresh mint.",
    dietary_tags: ["Organic", "Vegan"],
    is_featured: false,
    display_order: 5,
    image_url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "menu-6",
    business_unit_id: "bu2",
    name: "Crisp Suya Caesar Salad",
    price: 5200,
    category: "Starters",
    description: "Fresh Romaine lettuce, crunchy garlic croutons, and shaved parmesan cheese, topped with spicy flame-grilled chicken suya strips and creamy Caesar dressing.",
    dietary_tags: ["Spicy"],
    is_featured: false,
    display_order: 6,
    image_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800"
  }
];

const MOCK_LAUNDRY_SERVICES = [
  {
    id: "laun-1",
    business_unit_id: "bu3",
    name: "Wash & Fold Everyday Clean",
    description: "Ideal for everyday apparel: t-shirts, jeans, shorts, underwear, and gym wears. Clothes are color-sorted, washed with premium detergents, tumble-dried, and neatly folded.",
    turnaround_time: "24 Hours",
    price_from: 2500,
    image_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
    display_order: 1,
    is_active: true
  },
  {
    id: "laun-2",
    business_unit_id: "bu3",
    name: "Premium Dry Cleaning & Pressing",
    description: "Specialized delicate treatment for suits, blazers, evening gowns, wedding dresses, and traditional native garments (Agbadas, Kaftans). Stains are pre-treated, and clothes are pressed to crisp perfection.",
    turnaround_time: "48 Hours",
    price_from: 5000,
    image_url: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&q=80&w=800",
    display_order: 2,
    is_active: true
  },
  {
    id: "laun-3",
    business_unit_id: "bu3",
    name: "Express Same-Day Wash & Iron",
    description: "In a hurry for a meeting or flight? Drop off your garments before 10 AM, and pick them up freshly washed, steamed, ironed, and on hangers in less than 6 hours.",
    turnaround_time: "6 Hours",
    price_from: 7500,
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    display_order: 3,
    is_active: true
  },
  {
    id: "laun-4",
    business_unit_id: "bu3",
    name: "Bulk Institutional/Corporate Plan",
    description: "Comprehensive linen and laundry solutions for local boutique hotels, shortlet operators, fine dining restaurants, spas, and gyms. Weekly scheduled pickup and delivery included.",
    turnaround_time: "Flexible Scheduling",
    price_from: 25000,
    image_url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800",
    display_order: 4,
    is_active: true
  }
];

const MOCK_DEALS_PROMOTIONS = [
  {
    id: "deal-1",
    business_unit_id: "bu3",
    title: "First Wash Welcome Deal",
    description: "Experience the REOL difference. Get 20% off your very first laundry or dry cleaning request with us.",
    discount_label: "20% OFF",
    is_active: true
  },
  {
    id: "deal-2",
    business_unit_id: "bu3",
    title: "Mid-Week Agbada Special",
    description: "Bring in 3 Agbadas or Kaftans for dry cleaning on Tuesdays or Wednesdays, and get the 4th cleaned free!",
    discount_label: "4TH FOR FREE",
    is_active: true
  }
];

const MOCK_TESTIMONIALS = [
  {
    id: "test-1",
    business_unit_id: "bu1",
    author_name: "Mrs. Toyin Adebayo",
    content: "We hosted our corporate end-of-year dinner at the REOL Event Center. The facility is world-class, the AC was ice cold, and the backup generators kicked in within seconds during power fluctuations. Excellent service and support!",
    rating: 5,
    is_featured: true
  },
  {
    id: "test-2",
    business_unit_id: "bu2",
    author_name: "Femi Olowu (Lagos Foodie)",
    content: "I'm extremely picky with Jollof, but REOL Eatery's smokey jollof has won me over. Their firewood flavor is authentic, the portions are massive, and the suya platter was beautifully grilled. Highly recommended!",
    rating: 5,
    is_featured: true
  },
  {
    id: "test-3",
    business_unit_id: "bu3",
    author_name: "Chiamaka Nze",
    content: "Best dry cleaners in Lagos! I brought in a heavily stained white silk kaftan that I thought was ruined. They returned it looking absolutely pristine. Turnaround times are highly reliable, and staff are incredibly polite.",
    rating: 5,
    is_featured: true
  }
];

const MOCK_COMING_SOON_UNITS = [
  {
    id: "soon-1",
    name: "REOL Shortlet Suites",
    description: "Luxury 1 & 2 bedroom boutique suites located on the upper floors. Offering 24/7 solar + grid power, high-security fingerprint locks, private workspace, superfast fiber internet, and premium concierge service.",
    icon: "Home",
    expected_launch_label: "Opening Q3 2026",
    display_order: 1
  },
  {
    id: "soon-2",
    name: "Nexus Auto Spa & Detailers",
    description: "Professional high-pressure touchless washing, engine steam cleaning, internal leather detailing, and premium hydrophobic waxing. Have your car detailed while you dine at the Eatery or attend an event.",
    icon: "Car",
    expected_launch_label: "Launching Q4 2026",
    display_order: 2
  },
  {
    id: "soon-3",
    name: "REOL Express Mini-Mart",
    description: "Your 24/7 convenience hub under our roof. Stocked with premium beverages, snacks, daily essentials, toiletries, and high-quality local and imported groceries for quick grab-and-go convenience.",
    icon: "ShoppingBag",
    expected_launch_label: "Opening Q1 2027",
    display_order: 3
  }
];

const MOCK_GALLERY_IMAGES = [
  {
    id: "gal-1",
    business_unit_id: "bu1",
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    caption: "Grand Banquet Hall wedding reception setup",
    display_order: 1
  },
  {
    id: "gal-2",
    business_unit_id: "bu1",
    image_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
    caption: "Corporate gala dinner banquet layout",
    display_order: 2
  },
  {
    id: "gal-3",
    business_unit_id: "bu2",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    caption: "Signature grill platter at the Eatery dining room",
    display_order: 3
  },
  {
    id: "gal-4",
    business_unit_id: "bu3",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    caption: "Garments packaged and prepped for home delivery",
    display_order: 4
  }
];

let MOCK_PUBLIC_ENQUIRIES = [
  {
    id: "enq-1",
    type: "event_enquiry",
    full_name: "Adeboye Benson",
    phone: "+234 803 111 2222",
    email: "a.benson@bensongroup.ng",
    message: "Interested in booking the Grand Banquet Hall for our annual AGM and staff gala. Need information on custom AV installation support.",
    metadata: {
      package_id: "pack-gold",
      package_name: "Gold Royale Package",
      guest_count: 350,
      event_date: "2026-07-15"
    },
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: "enq-2",
    type: "eatery_order",
    full_name: "Chioma Nze",
    phone: "+234 812 345 6789",
    email: "chioma.nze@yahoo.com",
    message: "Please deliver hot. Contact me on phone when rider arrives at the estate gate.",
    metadata: {
      order_items: "2x Firewood Jollof Rice (Special), 1x Royal Grilled Platter, 3x Zobo Cooler",
      delivery_address: "Apartment 4B, Silver Oak Estate, Lekki Phase 1",
      delivery_slot: "12:30 PM - 1:00 PM"
    },
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: "enq-3",
    type: "laundry_pickup",
    full_name: "Olumide Alao",
    phone: "+234 809 999 8888",
    email: "o.alao@alawyers.com",
    message: "Starch should be medium on the native wears. Need them back before Friday morning.",
    metadata: {
      pickup_address: "Plot 15, Admiralty Way, Lekki Phase 1",
      pickup_date: "2026-07-01",
      service_id: "serv-native",
      service_name: "Royal Native Wear Care"
    },
    status: "contacted",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  {
    id: "enq-4",
    type: "notify_me",
    full_name: "Tunde Folawiyo",
    phone: null,
    email: "t.folawiyo@tundemotors.com",
    message: "Interested in the Auto Spa wash packages launch notifications.",
    metadata: {
      unit_id: "soon-2",
      unit_name: "REOL Auto Spa & Wash"
    },
    status: "qualified",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
  },
  {
    id: "enq-5",
    type: "contact",
    full_name: "Bolanle Cole",
    phone: "+234 802 222 3333",
    email: "bolanle@coleevents.com",
    message: "Hi, I am an event planner. I wanted to ask if you have special corporate partnership discounts if I bring multiple wedding clients to your Event Center this year. Let me know your terms.",
    metadata: {},
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString() // 3 days ago
  }
];

function createMockQueryBuilder(table: string, cookieStoreOrRequest: any, isMiddleware = false) {
  const getCookie = (name: string) => {
    if (isMiddleware) {
      return cookieStoreOrRequest.cookies.get(name)?.value;
    } else {
      return cookieStoreOrRequest.get(name)?.value;
    }
  };

  const fullName = getCookie("reol-nexus-fullname") || "Akinseinde Ebenezer";
  const onboarded = getCookie("reol-nexus-onboarded") === "true";

  let isSingle = false;
  let isInsert = false;
  let isUpdate = false;
  let updatePayload: any = null;
  let eqField: string = "";
  let eqValue: any = null;

  let mockData: any = [];
  if (table === "profiles") {
    mockData = {
      id: "mock-user-123",
      full_name: fullName,
      org_id: onboarded ? "mock-org-123" : null,
      organizations: {
        name: "REOL GLOBAL SOLUTIONS LIMITED"
      }
    };
  } else if (table === "business_units") {
    mockData = [
      { id: "bu1", name: "Event Center", org_id: "mock-org-123", slug: "event-center", type: "event_center", color: "#D4AF37" },
      { id: "bu2", name: "Eatery", org_id: "mock-org-123", slug: "eatery", type: "eatery", color: "#FF5733" },
      { id: "bu3", name: "Laundry", org_id: "mock-org-123", slug: "laundry", type: "laundry", color: "#33B5E5" },
    ];
  } else if (table === "event_packages") {
    mockData = MOCK_EVENT_PACKAGES;
  } else if (table === "event_terms") {
    mockData = MOCK_EVENT_TERMS;
  } else if (table === "menu_items") {
    mockData = MOCK_MENU_ITEMS;
  } else if (table === "laundry_services") {
    mockData = MOCK_LAUNDRY_SERVICES;
  } else if (table === "deals_promotions") {
    mockData = MOCK_DEALS_PROMOTIONS;
  } else if (table === "testimonials") {
    mockData = MOCK_TESTIMONIALS;
  } else if (table === "coming_soon_units") {
    mockData = MOCK_COMING_SOON_UNITS;
  } else if (table === "gallery_images") {
    mockData = MOCK_GALLERY_IMAGES;
  } else if (table === "public_enquiries") {
    mockData = MOCK_PUBLIC_ENQUIRIES;
  } else {
    mockData = [];
  }

  const builder: any = {
    select(fields?: string) {
      return builder;
    },
    eq(field: string, value: any) {
      eqField = field;
      eqValue = value;
      // Filter mockData if it's an array and matching a simple filter
      if (Array.isArray(mockData)) {
        mockData = mockData.filter((item: any) => {
          if (field === "status" && value === "active") return item.is_active !== false;
          if (field === "is_active") return item.is_active === value;
          if (field === "org_id" || field === "business_unit_id") return true; // keep for simple mocking
          if (item[field] !== undefined) {
            return String(item[field]) === String(value);
          }
          return true;
        });
      }
      return builder;
    },
    order(field: string, options?: any) {
      return builder;
    },
    limit(val: number) {
      if (Array.isArray(mockData)) {
        mockData = mockData.slice(0, val);
      }
      return builder;
    },
    single() {
      isSingle = true;
      return builder;
    },
    insert(data: any) {
      isInsert = true;
      if (table === "public_enquiries") {
        const newEnq = {
          id: "enq-" + Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          status: "new",
          ...data
        };
        MOCK_PUBLIC_ENQUIRIES.unshift(newEnq);
      }
      return builder;
    },
    update(data: any) {
      isUpdate = true;
      updatePayload = data;
      return builder;
    },
    then(resolve: any) {
      let resolvedData = mockData;
      if (isUpdate && eqField === "id" && table === "public_enquiries") {
        MOCK_PUBLIC_ENQUIRIES = MOCK_PUBLIC_ENQUIRIES.map((item) =>
          item.id === eqValue ? { ...item, ...updatePayload } : item
        );
        resolvedData = MOCK_PUBLIC_ENQUIRIES.find(item => item.id === eqValue) || null;
      } else if (isInsert) {
        resolvedData = { id: "mock-inserted-id" };
      }
      
      const result = {
        data: isSingle ? (Array.isArray(resolvedData) ? resolvedData[0] || null : resolvedData) : resolvedData,
        error: null
      };
      
      if (resolve) {
        resolve(result);
      }
      return Promise.resolve(result);
    }
  };

  return builder;
}

export async function createMockClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get("reol-nexus-session")?.value;

  return {
    auth: {
      async getUser() {
        if (session === "authenticated") {
          return {
            data: {
              user: {
                id: "mock-user-123",
                email: "ebendttl@gmail.com",
                user_metadata: { full_name: "Akinseinde Ebenezer" }
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error("No session") };
      },
      async signInWithPassword({ email }: any) {
        cookieStore.set("reol-nexus-session", "authenticated", { path: "/" });
        cookieStore.set("reol-nexus-onboarded", "true", { path: "/" });
        return { data: { user: { id: "mock-user-123" } }, error: null };
      },
      async signUp({ email, options }: any) {
        cookieStore.set("reol-nexus-session", "authenticated", { path: "/" });
        cookieStore.set("reol-nexus-fullname", options?.data?.full_name || "Manager", { path: "/" });
        cookieStore.set("reol-nexus-onboarded", "false", { path: "/" });
        return { data: { user: { id: "mock-user-123" } }, error: null };
      },
      async signOut() {
        cookieStore.delete("reol-nexus-session");
        cookieStore.delete("reol-nexus-onboarded");
        cookieStore.delete("reol-nexus-fullname");
        return { error: null };
      }
    },
    from(table: string) {
      return createMockQueryBuilder(table, cookieStore, false);
    },
    async rpc(fn: string, args: any) {
      if (fn === "initialize_new_organization") {
        cookieStore.set("reol-nexus-onboarded", "true", { path: "/" });
        return { error: null };
      }
      return { error: null };
    }
  } as any;
}

export function createMockClientForRequest(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("reol-nexus-session")?.value;

  return {
    auth: {
      async getUser() {
        if (session === "authenticated") {
          return {
            data: {
              user: {
                id: "mock-user-123",
                email: "ebendttl@gmail.com",
                user_metadata: { full_name: "Akinseinde Ebenezer" }
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error("No session") };
      }
    },
    from(table: string) {
      return createMockQueryBuilder(table, request, true);
    }
  } as any;
}
