import React from 'react';
import { FiMapPin, FiClock, FiCalendar, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { TRADE_COLORS } from '../constants/trades';

const InternshipCard = ({ internship, onApply, showApply = false, applied = false }) => {
  const {
    internship_id, title, description, trade, level_required,
    company_name, company_location, location, duration, deadline, status
  } = internship;

  const tradeColor = TRADE_COLORS[trade] || 'bg-gray-100 text-gray-800 border-gray-200';
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 7 && daysLeft > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Company avatar */}
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
            {(company_name || 'C').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{company_name}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tradeColor}`}>
            {trade}
          </span>
          {level_required && level_required !== 'Any' && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {level_required}
            </span>
          )}
          {isUrgent && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
              {daysLeft}d left
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Card Details */}
      <div className="px-5 py-3 border-t border-gray-50 space-y-1.5">
        {(location || company_location) && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiMapPin size={12} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{location || company_location}</span>
          </div>
        )}
        {duration && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiClock size={12} className="text-gray-400 flex-shrink-0" />
            <span>{duration}</span>
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar size={12} className="text-gray-400 flex-shrink-0" />
            <span>Deadline: {new Date(deadline).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      {showApply && (
        <div className="p-4 pt-3 mt-auto">
          {applied ? (
            <div className="w-full text-center py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold border border-green-200">
              ✓ Applied
            </div>
          ) : (
            <button
              onClick={() => onApply && onApply(internship)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200 group"
            >
              Apply Now
              <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipCard;
