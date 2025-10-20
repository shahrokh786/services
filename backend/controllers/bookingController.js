import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
    const { serviceId, date, time, address, description } = req.body;
    const customerId = req.user._id; // The logged-in user is the customer

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const booking = new Booking({
            service: serviceId,
            customer: customerId,
            provider: service.user, // The 'user' field on the service is the provider
            date,
            time,
            address,
            description,
            price: service.price, // Get the price from the service itself
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error(`Error in createBooking: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bookings for the logged-in customer
// @route   GET /api/bookings/mybookings
// @access  Private (Customer)
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user._id }).populate('service', 'title images');
        res.json(bookings);
    } catch (error) {
        console.error(`Error in getMyBookings: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bookings for the logged-in provider
// @route   GET /api/bookings/provider
// @access  Private (Provider)
const getProviderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ provider: req.user._id }).populate('service', 'title').populate('customer', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error(`Error in getProviderBookings: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a booking status (e.g., confirm or complete)
// @route   PUT /api/bookings/:id
// @access  Private (Provider)
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Security check: Ensure the person updating the booking is the provider for that booking
        if (booking.provider.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        console.error(`Error in updateBookingStatus: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};


export {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
};
