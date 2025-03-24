import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaUserClock, FaHome, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle, FaEllipsisH } from 'react-icons/fa';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list or calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Load appointments data
  useEffect(() => {
    // Mock data loading
    const loadAppointments = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock appointment data
        const mockAppointments = [
          {
            id: 1,
            title: 'Property Showing - Luxury Apartment',
            clientName: 'Rahul Mehta',
            clientPhone: '+91 98765 43210',
            clientEmail: 'rahul.mehta@example.com',
            propertyId: 'PROP-2023-001',
            propertyAddress: '204, Diamond Heights, Bandra West, Mumbai',
            date: new Date(2023, 10, 21, 10, 30), // Nov 21, 2023, 10:30 AM
            duration: 60, // minutes
            status: 'confirmed',
            notes: 'Client is interested in 3BHK apartments with sea view. Budget: 3-4 Cr.'
          },
          {
            id: 2,
            title: 'Follow-up Meeting - Villa Purchase',
            clientName: 'Priya Sharma',
            clientPhone: '+91 87654 32109',
            clientEmail: 'priya.sharma@example.com',
            propertyId: 'PROP-2023-042',
            propertyAddress: '15, Palm Grove Villas, Whitefield, Bangalore',
            date: new Date(2023, 10, 22, 14, 0), // Nov 22, 2023, 2:00 PM
            duration: 45, // minutes
            status: 'pending',
            notes: 'Discuss financing options and closing timeline.'
          },
          {
            id: 3,
            title: 'Initial Consultation',
            clientName: 'Vikram Patel',
            clientPhone: '+91 76543 21098',
            clientEmail: 'vikram.p@example.com',
            propertyId: null,
            propertyAddress: null,
            date: new Date(2023, 10, 20, 11, 0), // Nov 20, 2023, 11:00 AM
            duration: 30, // minutes
            status: 'completed',
            notes: 'New client looking for investment properties in Gurgaon. Budget: 80L-1.2Cr.'
          },
          {
            id: 4,
            title: 'Property Showing - Commercial Space',
            clientName: 'Amit Joshi',
            clientPhone: '+91 65432 10987',
            clientEmail: 'amit.joshi@example.com',
            propertyId: 'PROP-2023-108',
            propertyAddress: '503, Tech Park, Electronic City, Bangalore',
            date: new Date(2023, 10, 23, 16, 30), // Nov 23, 2023, 4:30 PM
            duration: 90, // minutes
            status: 'confirmed',
            notes: 'Looking for office space for tech startup. Requires good connectivity and parking.'
          },
          {
            id: 5,
            title: 'Contract Discussion',
            clientName: 'Neha Kapoor',
            clientPhone: '+91 54321 09876',
            clientEmail: 'neha.k@example.com',
            propertyId: 'PROP-2023-075',
            propertyAddress: '1202, Sky Towers, Malad West, Mumbai',
            date: new Date(2023, 10, 24, 13, 0), // Nov 24, 2023, 1:00 PM
            duration: 60, // minutes
            status: 'cancelled',
            notes: 'Client wants to renegotiate terms before finalizing the purchase.'
          },
          {
            id: 6,
            title: 'Virtual Tour - Premium Penthouse',
            clientName: 'Raj Malhotra',
            clientPhone: '+91 43210 98765',
            clientEmail: 'raj.malhotra@example.com',
            propertyId: 'PROP-2023-032',
            propertyAddress: 'Penthouse 01, Emerald Heights, Golf Course Road, Gurgaon',
            date: new Date(2023, 10, 25, 10, 0), // Nov 25, 2023, 10:00 AM
            duration: 45, // minutes
            status: 'confirmed',
            notes: 'International client - will be joining via video call. Interested in premium penthouses.'
          }
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
      }, 800);
    };
    
    loadAppointments();
  }, []);
  
  // Format date based on type (time, full date, day)
  const formatDate = (date, type = 'full') => {
    if (type === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (type === 'day') {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by status
    if (filterStatus !== 'all' && appointment.status !== filterStatus) {
      return false;
    }
    
    // Filter by date
    if (filterDate === 'today') {
      const today = new Date();
      return appointment.date.toDateString() === today.toDateString();
    } else if (filterDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return appointment.date.toDateString() === tomorrow.toDateString();
    } else if (filterDate === 'week') {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return appointment.date >= today && appointment.date <= nextWeek;
    }
    
    return true;
  }).sort((a, b) => a.date - b.date);
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 max-w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your meetings and property showings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200">
            <FaPlus className="mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 md:mb-0">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <select
                id="date-filter"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">Next 7 Days</option>
              </select>
            </div>
          </div>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No appointments found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appointment
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-md">
                            {appointment.propertyId ? <FaHome className="text-blue-600" /> : <FaUserClock className="text-blue-600" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[140px] md:max-w-[200px]">
                              {appointment.title}
                            </div>
                            <div className="text-sm text-gray-500">{appointment.duration} minutes</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(appointment.date, 'day')}</div>
                        <div className="text-sm text-gray-500">{formatDate(appointment.date, 'time')}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.clientName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaPhone className="text-gray-400 mr-1" size={12} />
                          <span>{appointment.clientPhone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {appointment.propertyId ? (
                          <>
                            <div className="text-sm text-gray-900">{appointment.propertyId}</div>
                            <div className="text-sm text-gray-500 truncate max-w-[120px] md:max-w-[180px] lg:max-w-[220px] flex items-center">
                              <FaMapMarkerAlt className="text-gray-400 mr-1 flex-shrink-0" size={12} />
                              <span className="truncate">{appointment.propertyAddress}</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <button className="text-gray-500 hover:text-gray-700">
                            <FaEllipsisH />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Simple Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 min-w-[600px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">
              <FaCalendarAlt className="inline mr-2 text-blue-600" />
              November 2023
            </h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                &lt; Prev
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Today
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Next &gt;
              </button>
            </div>
          </div>
          
          <div className="min-w-[600px]">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid - Just a static representation for the UI */}
            <div className="grid grid-cols-7 gap-2">
              {/* Previous month days */}
              {[29, 30, 31].map((day) => (
                <div key={`prev-${day}`} className="h-24 md:h-28 border rounded-lg p-2 bg-gray-50">
                  <span className="text-gray-400">{day}</span>
                </div>
              ))}
              
              {/* Current month days */}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                // Count appointments for this day
                const dayAppointments = appointments.filter(apt => 
                  apt.date.getDate() === day && 
                  apt.date.getMonth() === 10 // November (0-based)
                );
                
                const isToday = day === 20; // Just for the UI, pretend Nov 20 is today
                
                return (
                  <div 
                    key={`day-${day}`} 
                    className={`h-24 md:h-28 border rounded-lg p-2 overflow-hidden ${isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`${isToday ? 'text-blue-600 font-bold' : ''}`}>{day}</span>
                      {dayAppointments.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Display max 2 appointments, indicate if there are more */}
                    {dayAppointments.slice(0, 2).map((apt, idx) => (
                      <div 
                        key={apt.id} 
                        className={`text-xs px-1.5 py-1 my-0.5 rounded truncate ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {formatDate(apt.date, 'time')} - {apt.title.substring(0, 15)}...
                      </div>
                    ))}
                    
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 px-1 mt-1">
                        +{dayAppointments.length - 2} more...
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Next month days */}
              {[1, 2].map((day) => (
                <div key={`next-${day}`} className="h-24 md:h-28 border rounded-lg p-2 bg-gray-50">
                  <span className="text-gray-400">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments; 