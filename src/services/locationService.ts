import { City, State } from 'country-state-city';

export interface CityOption {
  name: string;
  state: string;
  stateCode: string;
  label: string;
}

export interface LocationInfo {
  name: string;
  pincode: string;
  branchType?: string;
  deliveryStatus?: string;
}

// Pre-compiled fast offline location data for high-frequency cities
const POPULAR_CITY_LOCATIONS: Record<string, LocationInfo[]> = {
  Warangal: [
    { name: 'Kareemabad', pincode: '506002' },
    { name: 'Hanamkonda', pincode: '506001' },
    { name: 'Kazipet', pincode: '506003' },
    { name: 'Subedari', pincode: '506001' },
    { name: 'Bheemaram', pincode: '506015' },
    { name: 'Naimnagar', pincode: '506009' },
    { name: 'Ramannapet', pincode: '506002' },
    { name: 'Matwada', pincode: '506002' },
    { name: 'Ursu Gutta', pincode: '506005' },
    { name: 'Fort Warangal', pincode: '506005' },
  ],
  Hyderabad: [
    { name: 'Banjara Hills', pincode: '500034' },
    { name: 'Jubilee Hills', pincode: '500033' },
    { name: 'Hitech City', pincode: '500081' },
    { name: 'Gachibowli', pincode: '500032' },
    { name: 'Madhapur', pincode: '500081' },
    { name: 'Secunderabad', pincode: '500003' },
    { name: 'Kukatpally', pincode: '500072' },
    { name: 'Kondapur', pincode: '500084' },
    { name: 'Begumpet', pincode: '500016' },
    { name: 'Ameerpet', pincode: '500016' },
    { name: 'Charminar', pincode: '500002' },
  ],
  Bengaluru: [
    { name: 'Koramangala', pincode: '560034' },
    { name: 'Indiranagar', pincode: '560038' },
    { name: 'Whitefield', pincode: '560066' },
    { name: 'Electronic City', pincode: '560100' },
    { name: 'HSR Layout', pincode: '560102' },
    { name: 'Jayanagar', pincode: '560041' },
    { name: 'Malleshwaram', pincode: '560003' },
    { name: 'Marathahalli', pincode: '560037' },
  ],
  Bangalore: [
    { name: 'Koramangala', pincode: '560034' },
    { name: 'Indiranagar', pincode: '560038' },
    { name: 'Whitefield', pincode: '560066' },
    { name: 'Electronic City', pincode: '560100' },
    { name: 'HSR Layout', pincode: '560102' },
    { name: 'Jayanagar', pincode: '560041' },
  ],
  Mumbai: [
    { name: 'Andheri West', pincode: '400058' },
    { name: 'Andheri East', pincode: '400069' },
    { name: 'Bandra West', pincode: '400050' },
    { name: 'Bandra East', pincode: '400051' },
    { name: 'Colaba', pincode: '400005' },
    { name: 'Borivali West', pincode: '400092' },
    { name: 'Dadar', pincode: '400014' },
    { name: 'Powai', pincode: '400076' },
    { name: 'Worli', pincode: '400018' },
  ],
  Delhi: [
    { name: 'Connaught Place', pincode: '110001' },
    { name: 'Karol Bagh', pincode: '110005' },
    { name: 'Hauz Khas', pincode: '110016' },
    { name: 'Saket', pincode: '110017' },
    { name: 'Dwarka', pincode: '110075' },
    { name: 'Rohini', pincode: '110085' },
    { name: 'Vasant Kunj', pincode: '110070' },
    { name: 'Lajpat Nagar', pincode: '110024' },
  ],
  Chennai: [
    { name: 'T. Nagar', pincode: '600017' },
    { name: 'Adyar', pincode: '600020' },
    { name: 'Anna Nagar', pincode: '600040' },
    { name: 'Velachery', pincode: '600042' },
    { name: 'Mylapore', pincode: '600004' },
    { name: 'Guindy', pincode: '600032' },
  ],
  Kolkata: [
    { name: 'Salt Lake', pincode: '700064' },
    { name: 'Park Street', pincode: '700016' },
    { name: 'New Town', pincode: '700156' },
    { name: 'Ballygunge', pincode: '700019' },
    { name: 'Alipore', pincode: '700027' },
  ],
  Pune: [
    { name: 'Kothrud', pincode: '411038' },
    { name: 'Hinjawadi', pincode: '411057' },
    { name: 'Viman Nagar', pincode: '411014' },
    { name: 'Wakad', pincode: '411057' },
    { name: 'Shivaji Nagar', pincode: '411005' },
    { name: 'Baner', pincode: '411045' },
  ],
  Ahmedabad: [
    { name: 'Satellite', pincode: '380015' },
    { name: 'Vastrapur', pincode: '380015' },
    { name: 'Navrangpura', pincode: '380009' },
    { name: 'Bodakdev', pincode: '380054' },
    { name: 'Maninagar', pincode: '380008' },
  ],
  Jaipur: [
    { name: 'Malviya Nagar', pincode: '302017' },
    { name: 'Vaishali Nagar', pincode: '302021' },
    { name: 'Mansarovar', pincode: '302020' },
    { name: 'C-Scheme', pincode: '302001' },
    { name: 'Raja Park', pincode: '302004' },
  ],
  Visakhapatnam: [
    { name: 'MVP Colony', pincode: '530017' },
    { name: 'Gajuwaka', pincode: '530026' },
    { name: 'Siripuram', pincode: '530003' },
    { name: 'Madhurawada', pincode: '530048' },
  ],
  Vijayawada: [
    { name: 'Benz Circle', pincode: '520010' },
    { name: 'Governorpet', pincode: '520002' },
    { name: 'Patamata', pincode: '520010' },
    { name: 'Bhavanipuram', pincode: '520012' },
  ],
  Coimbatore: [
    { name: 'RS Puram', pincode: '641002' },
    { name: 'Gandhipuram', pincode: '641012' },
    { name: 'Peelamedu', pincode: '641004' },
    { name: 'Saibaba Colony', pincode: '641011' },
  ],
};

// In-memory cache for API results
const locationCache: Record<string, LocationInfo[]> = {};

/**
 * Returns all Indian cities powered by country-state-city package (4,200+ cities)
 */
export const getAllIndianCities = (): CityOption[] => {
  const cities = City.getCitiesOfCountry('IN') || [];
  
  // Create state map for quick name resolution
  const states = State.getStatesOfCountry('IN') || [];
  const stateMap: Record<string, string> = {};
  states.forEach((s) => {
    stateMap[s.isoCode] = s.name;
  });

  return cities.map((c) => {
    const stateName = stateMap[c.stateCode] || c.stateCode;
    return {
      name: c.name,
      state: stateName,
      stateCode: c.stateCode,
      label: `${c.name} (${stateName})`,
    };
  });
};

/**
 * Fetch locations and suggested pincodes for any Indian city
 * 1. Checks curated offline database
 * 2. Fetches live locations and pincodes from India Post API (https://api.postalpincode.in)
 */
export const getCityLocationsAndPincodes = async (
  cityName: string
): Promise<{ locations: LocationInfo[]; pincodes: string[] }> => {
  if (!cityName || !cityName.trim()) {
    return { locations: [], pincodes: [] };
  }

  const cleanCity = cityName.trim();
  const normalizedKey = cleanCity.toLowerCase();

  // Check cache first
  if (locationCache[normalizedKey]) {
    const locs = locationCache[normalizedKey];
    const uniquePins = Array.from(new Set(locs.map((l) => l.pincode).filter(Boolean)));
    return { locations: locs, pincodes: uniquePins };
  }

  // Check popular offline dict
  const foundPopular = Object.keys(POPULAR_CITY_LOCATIONS).find(
    (k) => k.toLowerCase() === normalizedKey
  );
  let baseLocations: LocationInfo[] = foundPopular ? [...POPULAR_CITY_LOCATIONS[foundPopular]] : [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(cleanCity)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice)) {
        const liveLocations: LocationInfo[] = data[0].PostOffice.map((po: any) => ({
          name: po.Name,
          pincode: po.Pincode,
          branchType: po.BranchType,
          deliveryStatus: po.DeliveryStatus,
        }));

        // Merge without duplicates
        const seen = new Set<string>();
        const merged: LocationInfo[] = [];

        [...baseLocations, ...liveLocations].forEach((item) => {
          const key = `${item.name.toLowerCase()}-${item.pincode}`;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
        });

        locationCache[normalizedKey] = merged;
        const uniquePins = Array.from(new Set(merged.map((l) => l.pincode).filter(Boolean)));
        return { locations: merged, pincodes: uniquePins };
      }
    }
  } catch {
    // Return fallback if network is slow or offline
  }

  if (baseLocations.length > 0) {
    locationCache[normalizedKey] = baseLocations;
    const uniquePins = Array.from(new Set(baseLocations.map((l) => l.pincode).filter(Boolean)));
    return { locations: baseLocations, pincodes: uniquePins };
  }

  return { locations: [], pincodes: [] };
};

/**
 * Look up post offices, city, and state by 6-digit Pincode
 */
export const lookupByPincode = async (
  pincode: string
): Promise<{ city?: string; state?: string; locations: LocationInfo[] } | null> => {
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return null;
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice)) {
        const poList = data[0].PostOffice;
        const first = poList[0];
        const locations: LocationInfo[] = poList.map((po: any) => ({
          name: po.Name,
          pincode: po.Pincode,
          branchType: po.BranchType,
          deliveryStatus: po.DeliveryStatus,
        }));

        return {
          city: first.District || first.Division || first.Circle,
          state: first.State,
          locations,
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
};
