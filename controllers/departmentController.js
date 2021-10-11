const __departmentSchema = require('../model/departments');

const calSkip = (page, size) => {
    return (page - 1) * size;
};

const calPage = (count, size) => {
    return Math.ceil(count / size);
};

const GetAll = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || process.env.PAGE_PAGINATION_SIZE;

        const [_results, _count] = await Promise.all([
            __departmentSchema.find()
                .skip(calSkip(page, size))
                .limit(size)
                .exec(),
            __departmentSchema.countDocuments().exec()
        ]);

        return res.json({
            currentPage: page,
            pages: calPage(_count, size),
            currentCount: _results.length,
            totalCount: _count,
            data: _results
        });

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: error.message
        });
    }
}

const GetById = async (req, res) => {
    const users = await __departmentSchema.findOne({ _id: req.params.id });
    return res.status(200).send({
        status: 200,
        data: users,
        message: 'Success'
    });
}

const Create = async (req, res) => {
    try {
        const { title, description, is_status, mail_to, mail_cc, mail_bc } = req.body;

        if (!(title)) {
            return res.status(400).send({
                status: "error",
                message: "All input is required"
            });
        }

        const departments = await __departmentSchema.create({
            title: title,
            description: description,
        });

        if (typeof (is_status) == "boolean") {
            departments.is_status = is_status;
        }

        if (!(mail_to)) {
            departments.mail_to = mail_to;
        }

        if (!(mail_cc)) {
            departments.mail_cc = mail_cc;
        }

        if (!(mail_bc)) {
            departments.mail_bc = mail_bc;
        }

        departments.save();

        return res.status(201).json(departments);
    }
    catch (err) {
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
}

const Update = async (req, res) => {
    try {
        const { description, is_status, mail_to, mail_cc, mail_bc } = req.body;

        let obj = { updated_at: new Date() };
        // if (!(description)) {
        //     obj.add({ description: description });
        // }

        // if (typeof (is_status) == "boolean") {
        //     obj.add({ is_status: is_status });
        // }

        // if (!(mail_to)) {
        //     obj.add({ mail_to: mail_to });
        // }

        // if (!(mail_cc)) {
        //     obj.add({ mail_cc: mail_cc });
        // }

        // if (!(mail_bc)) {
        //     obj.add({ mail_bc: mail_bc });
        // }

        // doc.save();
        const doc = await __departmentSchema.findOneAndUpdate({ _id: req.params.id }, obj, { new: true });
        doc = await __departmentSchema.findOne({ _id: req.params.id });

        return res.status(401).json(doc);
    }
    catch (err) {
        return res.status(400).json({
            status: 'Bad Request',
            message: err.message,
        });
    }
}

const Delete = async (req, res) => {
    return res.status(400).send({
        status: "error",
        message: "Err!"
    });
}

module.exports = {
    GetAll,
    GetById,
    Create,
    Update,
    Delete,
}