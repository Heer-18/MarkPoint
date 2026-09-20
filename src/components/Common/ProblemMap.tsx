import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, ThumbsUp, CheckCircle2, Clock, AlertTriangle, Navigation } from 'lucide-react';
import { CivicIssue } from '../../types/civic';
import { CITIES } from '../Navigation/TopSearchBar';

interface ProblemMapProps {
  tickets: CivicIssue[];
  selectedTicket: CivicIssue | null;
  onSelectTicket: (ticket: CivicIssue) => void;
  centerCoords?: { lat: number; lng: number };
  heightClass?: string;
  showFilters?: boolean;
}

export const ProblemMap: React.FC<ProblemMapProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  centerCoords = { lat: 21.1702, lng: 72.8311 }, // Default to Surat, Gujarat
  heightClass = 'h-[360px] sm:h-[480px]',
  showFilters = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(13);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter / Clean OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);
    } catch (err) {
      console.warn('Map initialization:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center when city / coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && centerCoords) {
      mapInstanceRef.current.setView([centerCoords.lat, centerCoords.lng], 13, {
        animate: true
      });
      setCurrentZoom(13);
    }
  }, [centerCoords.lat, centerCoords.lng]);

  // Update Markers & Zoom-Aware City Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !circlesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    circlesLayerRef.current.clearLayers();

    // 1. ZOOMED OUT MODE (Zoom < 10): Show City Aggregation Badges Only
    if (currentZoom < 10) {
      // Group tickets by nearest city
      const cityCounts: { [cityName: string]: { count: number; lat: number; lng: number } } = {};

      CITIES.forEach((c) => {
        cityCounts[c.name] = { count: 0, lat: c.lat, lng: c.lng };
      });

      tickets.forEach((t) => {
        // Find closest city
        let bestCity = 'Surat';
        let minDist = 999999;
        CITIES.forEach((c) => {
          const d = Math.hypot(t.location.lat - c.lat, t.location.lng - c.lng);
          if (d < minDist) {
            minDist = d;
            bestCity = c.name;
          }
        });
        if (cityCounts[bestCity]) {
          cityCounts[bestCity].count += 1;
        }
      });

      // Render City Count Badges
      Object.entries(cityCounts).forEach(([cityName, data]) => {
        if (data.count === 0) return;

        const clusterIcon = L.divIcon({
          className: 'custom-city-cluster',
          html: `
            <div class="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl text-white font-bold text-xs cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-extrabold text-emerald-300">${cityName}</span>
              <span class="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">${data.count}</span>
            </div>
          `,
          iconSize: [110, 32]
        });

        const clusterMarker = L.marker([data.lat, data.lng], { icon: clusterIcon });
        clusterMarker.on('click', () => {
          mapInstanceRef.current?.setView([data.lat, data.lng], 13, { animate: true });
        });

        markersLayerRef.current?.addLayer(clusterMarker);
      });

      return;
    }

    // 2. ZOOMED IN MODE (Zoom >= 10): Show Detailed Individual Pins & 25m Anti-Spam Buffers
    tickets.forEach((ticket) => {
      const isResolved = ticket.status === 'VERIFIED_RESOLVED' || ticket.status === 'RESOLVED_DEMO';
      const isBreached = ticket.status === 'ESCALATED_SLA_BREACH';

      let markerColor = '#f59e0b'; // amber for waste default
      if (ticket.vertical === 'ROADS_MOBILITY') markerColor = '#f97316'; // orange for road
      else if (ticket.vertical === 'WATER_BODIES_ECOLOGY') markerColor = '#06b6d4'; // cyan for water
      else if (ticket.vertical === 'CIVIC_ASSETS') markerColor = '#a855f7'; // purple for assets / power
      else if (ticket.vertical === 'SOLID_WASTE') markerColor = '#eab308'; // yellow-amber for waste
      else markerColor = '#ec4899'; // pink for other

      if (isResolved) markerColor = '#10b981'; // emerald for resolved
      if (isBreached) markerColor = '#ef4444'; // red for breached

      // 25m Radius Anti-Spam Buffer
      if (!isResolved) {
        const circle = L.circle([ticket.location.lat, ticket.location.lng], {
          radius: 25,
          color: markerColor,
          weight: 1.5,
          fillColor: markerColor,
          fillOpacity: 0.15,
          dashArray: '3, 5'
        });
        circlesLayerRef.current?.addLayer(circle);
      }

      // Custom Clean HTML Pin
      const customIcon = L.divIcon({
        className: 'custom-problem-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer -translate-x-1/2 -translate-y-1/2 group">
            ${!isResolved ? `<span class="absolute w-7 h-7 rounded-full problem-pin-pulse" style="background: ${markerColor}35;"></span>` : ''}
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg border-2 text-white font-bold text-[10px]" style="background: ${markerColor}; border-color: #0f172a;">
              ${ticket.upvoteCount > 1 ? ticket.upvoteCount : '•'}
            </div>
          </div>
        `,
        iconSize: [28, 28]
      });

      const marker = L.marker([ticket.location.lat, ticket.location.lng], {
        icon: customIcon
      });

      // Quick Popup
      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 6px;">
          <div style="font-size: 12px; font-weight: 700; color: #10b981; margin-bottom: 2px;">
            ${ticket.subCategory}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
            ${ticket.address}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 6px;">
            <span style="font-weight: 600; color: #38bdf8;">👍 ${ticket.upvoteCount} Upvotes</span>
            <span style="font-weight: 600; color: #f87171;">${ticket.priority}</span>
          </div>
          <button id="inspect-map-${ticket.id}" style="width: 100%; background: #059669; color: white; border: none; padding: 5px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-map-${ticket.id}`);
        if (btn) {
          btn.onclick = () => onSelectTicket(ticket);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [tickets, selectedTicket, onSelectTicket, currentZoom]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl dark-map`}>
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Category Legend */}
      <div className="absolute top-2.5 right-2.5 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 shadow-xl pointer-events-none">
        {currentZoom < 10 ? (
          <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Showing City Summaries • Zoom in for street pins</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>Roads</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Waste</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Water</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Assets</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Other</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Fixed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
