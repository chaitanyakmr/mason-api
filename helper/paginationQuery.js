const db = require('../dbOperations')

// Generic function to perform paginated queries
const executePaginatedQuery = async (query, params, req) => {
    const pageSize = parseInt(req.pageSize, 10) || 10
    const page = parseInt(req.page, 10) || 1
    const offset = (page - 1) * pageSize
    // Query to get the total count of records without pagination
    const totalCountQuery = `SELECT COUNT(*) AS total FROM (${query}) AS count_query`
    const totalCountResult = await db.query(totalCountQuery, params)
    const totalRecords = totalCountResult.rows[0].total

    // Query to get the paginated results
    const paginatedQuery = `${query} LIMIT $${params.length + 1} OFFSET $${
        params.length + 2
    }`
    const paginatedResult = await db.query(paginatedQuery, [
        ...params,
        pageSize,
        offset,
    ])

    return {
        totalRecords: parseInt(totalRecords, 10),
        data: paginatedResult.rows,
        page: parseInt(page),
        totalPages: Math.ceil(totalRecords / pageSize),
    }
}

module.exports = executePaginatedQuery
