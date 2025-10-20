import Service from '../models/Service.js';

// @desc    Create a new review
// @route   POST /api/services/:id/reviews
// @access  Private (Logged-in users)
const createServiceReview = async (req, res) => {
    const { rating, comment } = req.body;
    const serviceId = req.params.id;

    try {
        const service = await Service.findById(serviceId);

        if (service) {
            // Check if the user has already reviewed this service
            const alreadyReviewed = service.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400).json({ message: 'You have already reviewed this service' });
                return;
            }

            // Create the new review object
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            // Add the new review to the service's reviews array
            service.reviews.push(review);

            // Update the number of reviews and the average rating
            service.numReviews = service.reviews.length;
            service.rating =
                service.reviews.reduce((acc, item) => item.rating + acc, 0) /
                service.reviews.length;

            await service.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        console.error(`Error in createServiceReview: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { createServiceReview };
