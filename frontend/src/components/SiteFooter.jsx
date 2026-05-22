import { Link } from 'react-router-dom'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-16 border-t border-[#eadfd2] bg-white/80 py-10 backdrop-blur-md">
      <div className="mx-auto max-w-[1500px] px-6 text-center text-sm text-[#5b6470]">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <Link to="/" className="font-medium text-[#1f2937] hover:text-[#8b5e34]">
            Home
          </Link>
          <Link to="/events" className="font-medium text-[#1f2937] hover:text-[#8b5e34]">
            Events
          </Link>
          <Link to="/contact" className="font-medium text-[#1f2937] hover:text-[#8b5e34]">
            Contact
          </Link>
          <Link to="/admin/login" className="font-medium text-[#8b5e34] hover:underline">
            Admin login
          </Link>
        </nav>
        <p className="mt-6 text-xs">
          © {year} EventEase. Weddings, catering, halls & event packages.
        </p>
      </div>
    </footer>
  )
}
