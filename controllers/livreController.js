import Livre from "../models/Livre.js";

// export const getLivres = async (req, res) => {
//   try {
//     const livres = await Livre.find();
//     res.json(livres);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getLivres = async (req, res) => {
    const filters = {};

    const {
        page: queryPage,
        limit: queryLimit,
        ...queryFilters
    } = req.query;
    const limit = parseInt(queryLimit) || 10;
    const page = parseInt(queryPage) || 1;
    const skip = (page - 1) * limit;
    const splitAndAdd = (field, operator, values) => {
        if (!filters[field]) filters[field] = {};
        filters[field][operator] = values.split(",");
    };

    Object.entries(queryFilters).forEach(([key, value]) => {
        switch (key) {
            case "_id":
                splitAndAdd("_id", "$all", value);
                break;

            case "genres":
                splitAndAdd("genre", "$in", value);
                break;

            case "allGenres":
                splitAndAdd("genre", "$all", value);
                break;

            case "excludeGenres":
                splitAndAdd("genre", "$nin", value);
                break;

            case "langue":
                filters.langue = value;
                break;

            case "titre":
                filters.titre = {
                    $regex: value,
                    $options: "i"
                };
                break;

            case "auteur":
                filters.auteur = {
                    $regex: value,
                    $options: "i"
                };
                break;

            case "search":
                if (!value || value.trim() === "") {
                    filters._id = {
                        $exists: false
                    };
                } else {
                    filters.$text = {
                        $search: value.trim(),
                        $caseSensitive: false,
                        $diacriticSensitive: false
                        
                    };
                }
                break;

        }
    });
    try {
        const count = await Livre.countDocuments(filters);
        // const livres = await Livre.find(filters).skip(skip).limit(limit);
        const livres = await Livre.find(filters);
        console.log('livres:', livres);
        res.json({
            data: livres,
            //   currentPage: Number(page),
            //   totalPages: Math.ceil(count / limit),
            //   totalItems: count,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const searchLivres = async (req, res) => {
    const {
        titre
    } = req.query;
    try {
        const livres = await Livre.find({
            titre: new RegExp(titre, 'i')
        });
        res.json(livres);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getLivreById = async (req, res) => {
    try {
        const livre = await Livre.findById(req.params.id);
        if (!livre) return res.status(404).json({
            message: 'Livre non trouvé'
        });
        res.json(livre);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const createLivre = async (req, res) => {
    const livre = new Livre(req.body);
    try {
        const nouveauLivre = await livre.save();
        res.status(201).json(nouveauLivre);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const updateLivre = async (req, res) => {
    try {
        const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!livre) return res.status(404).json({
            message: 'Livre non trouvé'
        });
        res.json(livre);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const deleteLivre = async (req, res) => {
    try {
        const livre = await Livre.findByIdAndDelete(req.params.id);
        if (!livre) return res.status(404).json({
            message: 'Livre non trouvé'
        });
        res.json({
            message: 'Livre supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const livresParGenre = async (req, res) => {
    const {
        genre
    } = req.params;
    try {
        const livres = await Livre.find({
            genre: genre
        });
        res.json(livres);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const livresParLangue = async (req, res) => {
    const {
        langue
    } = req.params;
    try {
        const livres = await Livre.find({
            langue: new RegExp(langue, 'i')
        });
        res.json(livres);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const livresParStock = async (req, res) => {
    const {
        stock
    } = req.query;
    try {
        const livres = await Livre.find({
            stock: {
                $gte: parseInt(stock)
            }
        });
        res.json(livres);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};