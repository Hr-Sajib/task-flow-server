import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm = this.query?.search as string;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: [
                    // Search through the regular fields like name, type, and brand
                    ...searchableFields.map((field) => ({
                        [field]: { $regex: searchTerm, $options: "i" },
                    })),
    
                    // Search through the symptoms array
                    {
                        simptoms: {
                            $elemMatch: { $regex: searchTerm, $options: "i" },
                        },
                    },
                ],
            });
        }
        return this;
    }
    
    
    

    filter() {
        const queryObj = { ...this.query };
        const excludeFields = ["search", "searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
    
        // Handle prescriptionRequired boolean filter
        if (queryObj.prescriptionRequired !== undefined) {
            // Convert string "true"/"false" to boolean
            queryObj.prescriptionRequired =
                String(queryObj.prescriptionRequired).toLowerCase() === "true";
        }
    
        // Only apply filter if there are additional conditions
        if (Object.keys(queryObj).length > 0) {
            const existingFilter = this.modelQuery.getFilter();
            this.modelQuery = this.modelQuery.find({
                ...existingFilter,
                ...queryObj,
            } as FilterQuery<T>);
        }
        return this;
    }

    sort() {
        const sort = (this.query?.sort as string)?.split(",").join(" ") || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    paginate() {
        const page = this.query?.page ? Number(this.query.page) : 1; // Default page = 1
        const limit = this.query?.limit ? Number(this.query.limit) : null; // Default to no limit
    
        if (limit) {
            const skip = (page - 1) * limit;
            this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        }
    
        return this;
    }
    

    fields() {
        const fields = (this.query?.fields as string)?.split(",").join(" ") || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this.query?.page) || 1;
        const limit = Number(this.query?.limit) || 10;
        const totalPage = Math.ceil(total / limit);
        return { page, limit, total, totalPage };
    }
}

export default QueryBuilder;