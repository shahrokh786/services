import Service from '../models/Service.js';

// @desc    Fetch all services (NOW WITH SEARCH AND FILTER LOGIC)
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
    try {
        // Build a query object based on the URL query parameters
        const query = {};

        if (req.query.keyword) {
            query.title = {
                $regex: req.query.keyword, // Search by keyword in the title
                $options: 'i', // Case-insensitive
            };
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        // We can add more filters here later (e.g., location, price range)

        const services = await Service.find(query).populate('user', 'name');
        res.json(services);
    } catch (error) {
        console.error(`Error in getAllServices: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- ALL OTHER FUNCTIONS REMAIN THE SAME ---

const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('user', 'name email phone');
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createService = async (req, res) => {
    try {
        const { title, category, description, price, priceType, location, experience, images } = req.body;
        const service = new Service({
            user: req.user._id,
            title, category, description, price, priceType, location, experience, images
        });
        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(400).json({ message: 'Error creating service' });
    }
};

const getMyServices = async (req, res) => {
    try {
        const services = await Service.find({ user: req.user._id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        if (service.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
        
        Object.assign(service, req.body);
        const updatedService = await service.save();
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        if (service.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
        
        await service.deleteOne();
        res.json({ message: 'Service removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export {
    getAllServices,
    getServiceById,
    createService,
    getMyServices,
    updateService,
    deleteService,
};

