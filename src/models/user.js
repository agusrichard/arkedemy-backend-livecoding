const db = require('../config/db')
const bcrypt = require('bcryptjs')

const create = (name, username, password) => {
  return new Promise((resolve, reject) => { db.query(
    `SELECT COUNT(*) AS total
     FROM users 
     WHERE username='${username}' 
     LIMIT 1;`, 
    (error, results, fields) => {
      if (!error) {
        const { total } = results[0]
        if (total !== 0) {
          resolve(false)
        } else {
          db.query(`INSERT INTO users(name, username, password) VALUES('${name}', '${username}', '${password}');`,
          (error, results, fields) => {
            if (error) {
              resolve(false)
            } else {
              resolve(true)
            }
          })
        }
      } else {
        throw new Error(error)
      }
    }
  )
  })
}

const getAll = (params) => {
  const { perPage, currentPage, search, sort } = params
  const conditions = `
  ${search && `WHERE ${search.map(v => `${v.keys} LIKE '%${v.value}%'`).join(' AND ')}`}
  ORDER BY ${sort.keys} ${sort.value === 0 ? 'ASC' : 'DESC'}
  LIMIT ${perPage}
  OFFSET ${(currentPage - 1) * perPage}
  `

  console.log(conditions)

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT *
       FROM users
       ${conditions};`,
       (error, results, fields) => {
         if (error) throw reject(error)
         resolve(results)
       }
    )
  })
}

const getById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT *
      FROM users
      WHERE id=${parseInt(id)};`,
      (error, results, fields) => {
        if (error) throw error
        if (results.length !== 0) {
          resolve(results[0])
        } else {
          resolve(false)
        } 
      }
    )
  })
}

const deleteById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT *
      FROM users
      WHERE id=${parseInt(id)};`,
      (error, results, fields) => {
        if (error) throw error
        if (results.length !== 0) {
          db.query(
            `DELETE FROM users
             WHERE id=${parseInt(id)};`,
             (error, results, fields) => {
               if (error) throw error
               resolve(true)
             }
          )
        } else {
          resolve(false)
        } 
      }
    )
  })
}

const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT *
      FROM users
      WHERE id=${parseInt(id)};`,
      (error, results, fields) => {
        if (error) throw error
        if (results.length !== 0) {
          db.query(
            `UPDATE users
             SET name='${data.name}', username='${data.username}', password='${data.password}'
             WHERE id=${parseInt(id)};`,
             (error, results, fields) => {
               if (error) throw error
               resolve(true)
             }
          )
        } else {
          resolve(false)
        } 
      }
    )
  })
}

module.exports = { create, getAll, getById, deleteById, updateUser }