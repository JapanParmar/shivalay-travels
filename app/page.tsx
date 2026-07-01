import Navigation from './components/Navigation';
import Hero from './components/EarthHero';
import LogoStrip from './components/LogoStrip';
import Philosophy from './components/Philosophy';
import DarkPanel from './components/DarkPanel';
import Destinations from './components/Destinations';
import TicketBooking from './components/TicketBooking';
import ItineraryPreview from './components/ItineraryPreview';
import Stats from './components/Stats';
import TravelGuides from './components/TravelGuides';
import JourneyPlanner from './components/JourneyPlanner';
import Memories from './components/Memories';
import EarthOutro from './components/EarthOutro';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Navigation />
      <main>
        {/* Hero — 2-col headline + ticket capture + trust signals */}
        <Hero />

        {/* Ticket Booking — direct flights, trains, buses, cruises */}
        <TicketBooking />

        {/* Partner / media ticker */}
        <LogoStrip />

        {/* Destinations — filter chips + horizontal scroll tiles + expandable details */}
        <Destinations />

        {/* How we work (4-step process) + FAQ accordion + philosophy */}
        <Philosophy />

        {/* Dark problem panel — why generic travel fails */}
        <DarkPanel />

        {/* Sample itinerary — day-by-day accordion + sticky booking card */}
        <ItineraryPreview />

        {/* Stat blocks */}
        <Stats />

        {/* Journey planner — conversational 6-step builder */}
        <JourneyPlanner />

        {/* Traveller stories — testimonials + media mentions */}
        <Memories />

        {/* Travel intelligence — categorised article guides */}
        <TravelGuides />

        {/* CTA outro */}
        <EarthOutro />
      </main>
      <Footer />
    </>
  );
}
