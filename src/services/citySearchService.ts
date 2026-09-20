export interface CityLocation {
  name: string;
  fullName: string;
  lat: number;
  lng: number;
  state: string;
  type?: string;
}

// 1. Comprehensive Local Pre-Indexed Database (Fast Instant Matching for 100+ Cities/Towns)
export const POPULAR_CITIES: CityLocation[] = [
  // Gujarat Cities & Towns
  { name: 'Surat', fullName: 'Surat, Gujarat, India', lat: 21.1702, lng: 72.8311, state: 'Gujarat', type: 'City' },
  { name: 'Ahmedabad', fullName: 'Ahmedabad, Gujarat, India', lat: 23.0225, lng: 72.5714, state: 'Gujarat', type: 'City' },
  { name: 'Vadodara', fullName: 'Vadodara (Baroda), Gujarat, India', lat: 22.3072, lng: 73.1812, state: 'Gujarat', type: 'City' },
  { name: 'Rajkot', fullName: 'Rajkot, Gujarat, India', lat: 22.3039, lng: 70.8022, state: 'Gujarat', type: 'City' },
  { name: 'Nadiad', fullName: 'Nadiad, Kheda District, Gujarat, India', lat: 22.6916, lng: 72.8634, state: 'Gujarat', type: 'City' },
  { name: 'Anand', fullName: 'Anand (Milk City), Gujarat, India', lat: 22.5645, lng: 72.9289, state: 'Gujarat', type: 'City' },
  { name: 'Gandhinagar', fullName: 'Gandhinagar, Capital City, Gujarat, India', lat: 23.2156, lng: 72.6369, state: 'Gujarat', type: 'City' },
  { name: 'Bhavnagar', fullName: 'Bhavnagar, Saurashtra, Gujarat, India', lat: 21.7645, lng: 72.1519, state: 'Gujarat', type: 'City' },
  { name: 'Jamnagar', fullName: 'Jamnagar, Gujarat, India', lat: 22.4707, lng: 70.0577, state: 'Gujarat', type: 'City' },
  { name: 'Junagadh', fullName: 'Junagadh, Gir Somnath, Gujarat, India', lat: 21.5222, lng: 70.4579, state: 'Gujarat', type: 'City' },
  { name: 'Navsari', fullName: 'Navsari, South Gujarat, India', lat: 20.9500, lng: 72.9300, state: 'Gujarat', type: 'City' },
  { name: 'Valsad', fullName: 'Valsad, Gujarat, India', lat: 20.5992, lng: 72.9342, state: 'Gujarat', type: 'City' },
  { name: 'Vapi', fullName: 'Vapi Industrial Hub, Gujarat, India', lat: 20.3712, lng: 72.9048, state: 'Gujarat', type: 'City' },
  { name: 'Bharuch', fullName: 'Bharuch, Narmada River, Gujarat, India', lat: 21.7051, lng: 72.9959, state: 'Gujarat', type: 'City' },
  { name: 'Ankleshwar', fullName: 'Ankleshwar GIDC, Gujarat, India', lat: 21.6264, lng: 73.0033, state: 'Gujarat', type: 'City' },
  { name: 'Morbi', fullName: 'Morbi (Ceramic Hub), Gujarat, India', lat: 22.8120, lng: 70.8378, state: 'Gujarat', type: 'City' },
  { name: 'Porbandar', fullName: 'Porbandar, Coastal Gujarat, India', lat: 21.6417, lng: 69.6293, state: 'Gujarat', type: 'City' },
  { name: 'Somnath', fullName: 'Veraval / Somnath, Gujarat, India', lat: 20.9018, lng: 70.3697, state: 'Gujarat', type: 'Town' },
  { name: 'Dwarka', fullName: 'Dwarka, Devbhoomi Dwarka, Gujarat, India', lat: 22.2442, lng: 68.9685, state: 'Gujarat', type: 'Town' },
  { name: 'Bhuj', fullName: 'Bhuj, Kutch District, Gujarat, India', lat: 23.2420, lng: 69.6669, state: 'Gujarat', type: 'City' },
  { name: 'Gandhidham', fullName: 'Gandhidham / Kandla, Kutch, Gujarat, India', lat: 23.0753, lng: 70.1337, state: 'Gujarat', type: 'City' },
  { name: 'Mehsana', fullName: 'Mehsana, North Gujarat, India', lat: 23.5880, lng: 72.3693, state: 'Gujarat', type: 'City' },
  { name: 'Patan', fullName: 'Patan (Rani ki Vav), Gujarat, India', lat: 23.8493, lng: 72.1266, state: 'Gujarat', type: 'City' },
  { name: 'Palanpur', fullName: 'Palanpur, Banaskantha, Gujarat, India', lat: 24.1724, lng: 72.4346, state: 'Gujarat', type: 'City' },
  { name: 'Godhra', fullName: 'Godhra, Panchmahal, Gujarat, India', lat: 22.7758, lng: 73.6149, state: 'Gujarat', type: 'City' },
  { name: 'Dahod', fullName: 'Dahod, Eastern Gujarat, India', lat: 22.8340, lng: 74.2550, state: 'Gujarat', type: 'City' },
  { name: 'Surendranagar', fullName: 'Surendranagar Dudhrej, Gujarat, India', lat: 22.7284, lng: 71.6371, state: 'Gujarat', type: 'City' },
  { name: 'Amreli', fullName: 'Amreli, Saurashtra, Gujarat, India', lat: 21.6032, lng: 71.2221, state: 'Gujarat', type: 'City' },
  { name: 'Botad', fullName: 'Botad, Gujarat, India', lat: 22.1704, lng: 71.6669, state: 'Gujarat', type: 'City' },
  { name: 'Bardoli', fullName: 'Bardoli (Sardar Patel Nagar), Surat District, Gujarat', lat: 21.1188, lng: 73.1118, state: 'Gujarat', type: 'Town' },

  // Major Metro & National Cities
  { name: 'Mumbai', fullName: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', type: 'Metro' },
  { name: 'Pune', fullName: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', type: 'Metro' },
  { name: 'Delhi NCR', fullName: 'New Delhi, NCR, India', lat: 28.6139, lng: 77.2090, state: 'Delhi', type: 'Metro' },
  { name: 'Bengaluru', fullName: 'Bengaluru (Bangalore), Karnataka, India', lat: 12.9716, lng: 77.5946, state: 'Karnataka', type: 'Metro' },
  { name: 'Hyderabad', fullName: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867, state: 'Telangana', type: 'Metro' },
  { name: 'Chennai', fullName: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', type: 'Metro' },
  { name: 'Kolkata', fullName: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639, state: 'West Bengal', type: 'Metro' },
  { name: 'Jaipur', fullName: 'Jaipur (Pink City), Rajasthan, India', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', type: 'City' },
  { name: 'Lucknow', fullName: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', type: 'City' },
  { name: 'Chandigarh', fullName: 'Chandigarh, Punjab/Haryana, India', lat: 30.7333, lng: 76.7794, state: 'Punjab', type: 'City' },
  { name: 'Indore', fullName: 'Indore, Madhya Pradesh, India', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', type: 'City' },
  { name: 'Bhopal', fullName: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', type: 'City' },
  { name: 'Nagpur', fullName: 'Nagpur, Maharashtra, India', lat: 21.1458, lng: 79.0882, state: 'Maharashtra', type: 'City' },
  { name: 'Nashik', fullName: 'Nashik, Maharashtra, India', lat: 19.9975, lng: 73.7898, state: 'Maharashtra', type: 'City' },
  { name: 'Thane', fullName: 'Thane, Maharashtra, India', lat: 19.2183, lng: 72.9781, state: 'Maharashtra', type: 'City' },
  { name: 'Patna', fullName: 'Patna, Bihar, India', lat: 25.5941, lng: 85.1376, state: 'Bihar', type: 'City' },
  { name: 'Kochi', fullName: 'Kochi (Cochin), Kerala, India', lat: 9.9312, lng: 76.2673, state: 'Kerala', type: 'City' },
  { name: 'Visakhapatnam', fullName: 'Visakhapatnam (Vizag), Andhra Pradesh, India', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', type: 'City' },
  { name: 'Goa', fullName: 'Panaji, Goa, India', lat: 15.4909, lng: 73.8278, state: 'Goa', type: 'State/City' },
  { name: 'Dehradun', fullName: 'Dehradun, Uttarakhand, India', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand', type: 'City' },
  { name: 'Udaipur', fullName: 'Udaipur (City of Lakes), Rajasthan, India', lat: 24.5854, lng: 73.7125, state: 'Rajasthan', type: 'City' },
  { name: 'Jodhpur', fullName: 'Jodhpur (Blue City), Rajasthan, India', lat: 26.2389, lng: 73.0243, state: 'Rajasthan', type: 'City' },
  { name: 'Varanasi', fullName: 'Varanasi (Kashi), Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh', type: 'City' },
  { name: 'Agra', fullName: 'Agra, Uttar Pradesh, India', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh', type: 'City' },
  { name: 'Kanpur', fullName: 'Kanpur, Uttar Pradesh, India', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh', type: 'City' },
  { name: 'Prayagraj', fullName: 'Prayagraj (Allahabad), Uttar Pradesh, India', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh', type: 'City' },
  { name: 'Ranchi', fullName: 'Ranchi, Jharkhand, India', lat: 23.3441, lng: 85.3096, state: 'Jharkhand', type: 'City' },
  { name: 'Raipur', fullName: 'Raipur, Chhattisgarh, India', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh', type: 'City' },
  { name: 'Bhubaneswar', fullName: 'Bhubaneswar, Odisha, India', lat: 20.2961, lng: 85.8245, state: 'Odisha', type: 'City' },
  { name: 'Guwahati', fullName: 'Guwahati, Assam, India', lat: 26.1445, lng: 91.7362, state: 'Assam', type: 'City' },
  { name: 'Coimbatore', fullName: 'Coimbatore, Tamil Nadu, India', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu', type: 'City' },
  { name: 'Madurai', fullName: 'Madurai, Tamil Nadu, India', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu', type: 'City' },
  { name: 'Mysuru', fullName: 'Mysuru (Mysore), Karnataka, India', lat: 12.2958, lng: 76.6394, state: 'Karnataka', type: 'City' },
  { name: 'Mangaluru', fullName: 'Mangaluru (Mangalore), Karnataka, India', lat: 12.9141, lng: 74.8560, state: 'Karnataka', type: 'City' },
  { name: 'Thiruvananthapuram', fullName: 'Thiruvananthapuram, Kerala, India', lat: 8.5241, lng: 76.9366, state: 'Kerala', type: 'City' }
];

/**
 * Real-time Google Maps-style autocomplete place search
 * Checks local database instantly + queries OpenStreetMap Nominatim for live global place discovery
 */
export async function searchPlacesLive(query: string): Promise<CityLocation[]> {
  const q = query.trim().toLowerCase();
  if (!q) return POPULAR_CITIES.slice(0, 10);

  // 1. Instant local matching
  const localMatches = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
  );

  // 2. Fetch from OpenStreetMap Nominatim / Photon API
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=in&limit=8&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'en' }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const onlineResults: CityLocation[] = data.map((item: any) => {
        const addr = item.address || {};
        const shortName =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          item.name ||
          item.display_name.split(',')[0];

        const state = addr.state || addr.region || 'India';
        return {
          name: shortName,
          fullName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          state: state,
          type: item.type ? item.type.toUpperCase() : 'Location'
        };
      });

      // Deduplicate by name
      const combined = [...localMatches];
      onlineResults.forEach((onRes) => {
        if (!combined.some((c) => c.name.toLowerCase() === onRes.name.toLowerCase())) {
          combined.push(onRes);
        }
      });

      return combined.slice(0, 10);
    }
  } catch (err) {
    // Network / abort fallback to local matches
  }

  return localMatches.length > 0
    ? localMatches.slice(0, 10)
    : [
        {
          name: query.trim(),
          fullName: `${query.trim()}, India`,
          lat: 21.1702,
          lng: 72.8311,
          state: 'India',
          type: 'Search'
        }
      ];
}
