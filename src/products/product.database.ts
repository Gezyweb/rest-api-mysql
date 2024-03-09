import { Product, UnitProduct, Products } from "./product.interface";
import { v4 as random } from "uuid";
import mysql from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rest_db"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database');
});

process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing database connection: ', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit();
    });
});

export const findAll = async (): Promise<UnitProduct[]> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export const findOne = async (id: string): Promise<UnitProduct> => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product WHERE id = ?', [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
};

export const create = async (productInfo: Product): Promise<null | UnitProduct> => {
    const { name, price, quantity, image } = productInfo;
    const id = random();
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO product (id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)',
            [id, name, price, quantity, image],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, name, price, quantity, image });
                }
            });
    });
};

export const update = async (id: string, updateValues: Product): Promise<UnitProduct | null> => {
    const { name, price, quantity, image } = updateValues;
    return new Promise((resolve, reject) => {
        db.query('UPDATE product SET name=?, price=?, quantity=?, image=? WHERE id=?',
            [name, price, quantity, image, id],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, name, price, quantity, image });
                }
            });
    });
};

export const remove = async (id: string): Promise<null | void> => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM product WHERE id=?', [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
