const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// SQLite veritabanı bağlantısı
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database bağlantı hatası:', err.message);
  } else {
    console.log('SQLite veritabanına bağlanıldı');
    initDb();
  }
});

// Veritabanı tablolarını oluştur
function initDb() {
  db.serialize(() => {
    // Kategoriler tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT NOT NULL
      )
    `);

    // İşlemler tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        categoryId INTEGER NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories (id)
      )
    `);

    // Varsayılan kategorileri ekle (eğer yoksa)
    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (err) {
        console.error('Kategori sayısı kontrol edilirken hata:', err.message);
        return;
      }

      if (row.count === 0) {
        const defaultCategories = [
          { name: 'Maaş', type: 'income', color: '#33FFF0' },
          { name: 'Freelance', type: 'income', color: '#FFF033' },
          { name: 'Yatırım Geliri', type: 'income', color: '#33FF57' },
          { name: 'Hediye', type: 'income', color: '#8833FF' },
          { name: 'Diğer Gelir', type: 'income', color: '#FF33E9' },
          { name: 'Kira', type: 'expense', color: '#FF5733' },
          { name: 'Market', type: 'expense', color: '#33FF57' },
          { name: 'Faturalar', type: 'expense', color: '#3357FF' },
          { name: 'Eğlence', type: 'expense', color: '#F033FF' },
          { name: 'Sağlık', type: 'expense', color: '#33FFEC' },
          { name: 'Ulaşım', type: 'expense', color: '#FFB533' },
          { name: 'Yemek', type: 'expense', color: '#FF335A' },
          { name: 'Alışveriş', type: 'expense', color: '#8CFF33' },
          { name: 'Diğer Gider', type: 'expense', color: '#33C1FF' }
        ];

        const stmt = db.prepare('INSERT INTO categories (name, type, color) VALUES (?, ?, ?)');
        
        defaultCategories.forEach(category => {
          stmt.run(category.name, category.type, category.color);
        });
        
        stmt.finalize();
        console.log('Varsayılan kategoriler eklendi');
      }
    });
  });
}

// API Endpoint'leri
// 1. Tüm işlemleri getir
app.get('/api/transactions', (req, res) => {
  const { startDate, endDate, categoryId, type } = req.query;
  let sql = 'SELECT t.*, c.name as categoryName, c.color as categoryColor FROM transactions t JOIN categories c ON t.categoryId = c.id';
  const params = [];
  
  // Filtreleme
  const whereClauses = [];
  
  if (startDate) {
    whereClauses.push('t.date >= ?');
    params.push(startDate);
  }
  
  if (endDate) {
    whereClauses.push('t.date <= ?');
    params.push(endDate);
  }
  
  if (categoryId) {
    whereClauses.push('t.categoryId = ?');
    params.push(categoryId);
  }
  
  if (type) {
    whereClauses.push('t.type = ?');
    params.push(type);
  }
  
  if (whereClauses.length > 0) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  sql += ' ORDER BY t.date DESC';
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Transactions sorgu hatası:', err.message);
      return res.status(500).json({ error: 'İşlemler getirilirken bir hata oluştu' });
    }
    
    res.json(rows);
  });
});

// 2. Yeni işlem ekle
app.post('/api/transactions', (req, res) => {
  const { description, amount, type, categoryId, date } = req.body;
  
  if (!description || !amount || !type || !categoryId || !date) {
    return res.status(400).json({ error: 'Tüm alanlar gereklidir' });
  }
  
  const sql = `
    INSERT INTO transactions (description, amount, type, categoryId, date)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [description, amount, type, categoryId, date], function(err) {
    if (err) {
      console.error('Transaction ekleme hatası:', err.message);
      return res.status(500).json({ error: 'İşlem eklenirken bir hata oluştu' });
    }
    
    // Eklenen işlemi geri döndür
    db.get(
      `SELECT t.*, c.name as categoryName, c.color as categoryColor 
       FROM transactions t 
       JOIN categories c ON t.categoryId = c.id 
       WHERE t.id = ?`,
      [this.lastID],
      (err, row) => {
        if (err) {
          console.error('Yeni işlem getirme hatası:', err.message);
          return res.status(500).json({ error: 'Yeni işlem getirilirken bir hata oluştu' });
        }
        
        res.status(201).json(row);
      }
    );
  });
});

// 3. İşlem güncelle
app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { description, amount, type, categoryId, date } = req.body;
  
  if (!description || !amount || !type || !categoryId || !date) {
    return res.status(400).json({ error: 'Tüm alanlar gereklidir' });
  }
  
  const sql = `
    UPDATE transactions
    SET description = ?, amount = ?, type = ?, categoryId = ?, date = ?
    WHERE id = ?
  `;
  
  db.run(sql, [description, amount, type, categoryId, date, id], function(err) {
    if (err) {
      console.error('Transaction güncelleme hatası:', err.message);
      return res.status(500).json({ error: 'İşlem güncellenirken bir hata oluştu' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'İşlem bulunamadı' });
    }
    
    // Güncellenen işlemi geri döndür
    db.get(
      `SELECT t.*, c.name as categoryName, c.color as categoryColor 
       FROM transactions t 
       JOIN categories c ON t.categoryId = c.id 
       WHERE t.id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.error('Güncellenen işlem getirme hatası:', err.message);
          return res.status(500).json({ error: 'Güncellenen işlem getirilirken bir hata oluştu' });
        }
        
        res.json(row);
      }
    );
  });
});

// 4. İşlem sil
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Transaction silme hatası:', err.message);
      return res.status(500).json({ error: 'İşlem silinirken bir hata oluştu' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'İşlem bulunamadı' });
    }
    
    res.status(204).send();
  });
});

// 5. Tüm kategorileri getir
app.get('/api/categories', (req, res) => {
  const { type } = req.query;
  let sql = 'SELECT * FROM categories';
  const params = [];
  
  if (type) {
    sql += ' WHERE type = ?';
    params.push(type);
  }
  
  sql += ' ORDER BY name ASC';
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Categories sorgu hatası:', err.message);
      return res.status(500).json({ error: 'Kategoriler getirilirken bir hata oluştu' });
    }
    
    res.json(rows);
  });
});

// 6. Bakiye bilgilerini getir
app.get('/api/balance', (req, res) => {
  db.all(
    `SELECT type, SUM(amount) as total FROM transactions GROUP BY type`,
    (err, rows) => {
      if (err) {
        console.error('Bakiye hesaplama hatası:', err.message);
        return res.status(500).json({ error: 'Bakiye bilgileri hesaplanırken bir hata oluştu' });
      }
      
      let income = 0;
      let expense = 0;
      
      rows.forEach(row => {
        if (row.type === 'income') {
          income = row.total;
        } else if (row.type === 'expense') {
          expense = row.total;
        }
      });
      
      const balance = income - expense;
      
      res.json({ balance, income, expense });
    }
  );
});

// 7. Aylık gelir/gider verilerini getir
app.get('/api/stats/monthly', (req, res) => {
  // SQLite'da tarih formatlaması ve gruplama
  // Bu basitleştirilmiş bir sürüm, gerçek uygulamada daha karmaşık bir sorgulama gerekebilir
  db.all(
    `SELECT 
      substr(date, 1, 7) as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    GROUP BY month
    ORDER BY month ASC`,
    (err, rows) => {
      if (err) {
        console.error('Aylık veri hesaplama hatası:', err.message);
        return res.status(500).json({ error: 'Aylık veriler hesaplanırken bir hata oluştu' });
      }
      
      // Ay isimlerini dönüştür (2023-01 -> Ocak)
      const monthNames = {
        '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
        '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
        '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
      };
      
      const formattedRows = rows.map(row => {
        const [year, month] = row.month.split('-');
        return {
          month: monthNames[month],
          income: row.income,
          expense: row.expense
        };
      });
      
      res.json(formattedRows);
    }
  );
});

// 8. Kategori bazlı harcama dağılımını getir
app.get('/api/stats/categories', (req, res) => {
  db.all(
    `SELECT 
      c.id, c.name, c.color, SUM(t.amount) as amount
    FROM transactions t
    JOIN categories c ON t.categoryId = c.id
    WHERE t.type = 'expense'
    GROUP BY t.categoryId
    ORDER BY amount DESC`,
    (err, rows) => {
      if (err) {
        console.error('Kategori dağılımı hesaplama hatası:', err.message);
        return res.status(500).json({ error: 'Kategori dağılımı hesaplanırken bir hata oluştu' });
      }
      
      res.json(rows);
    }
  );
});

// Server başlat
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
}); 