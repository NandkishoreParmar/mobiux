const fs = require('fs');
const filePath = 'totaldata.csv';
let data = fs.readFileSync(filePath, 'utf-8');
data = data.split('\n');

function totalSales(data) {
  let total = 0;
  for (let i = 1; i < data.length; i++) {
    let [date, sku, unitPrice, qty, saleTotal] = data[i].split(",");
    if (!saleTotal || isNaN(saleTotal)) {
      continue;
    }
    total += Number(saleTotal);
  }
  return total;
}

const result = totalSales(data);
console.log(`Total Sales: ${result}`);

function monthWiseSalesTotal(data) {
  let monthWise = {};
  for (let i = 1; i < data.length; i++) {
    if (!data[i].trim()) continue;
    let [date, sku, unitPrice, qty, total] = data[i].split(",");
    if (!date || !total) continue;
    let month = date.split("-")[1];
    if (!month || isNaN(Number(total))) continue;
    monthWise[month] = (monthWise[month] || 0) + Number(total);
  }
  return monthWise;
}

let monthWisesale = monthWiseSalesTotal(data);
console.log(monthWisesale);

function mostPopularItem(data) {
  let salesByMonth = {};
  for (let i = 1; i < data.length; i++) {
    let row = data[i].trim();
    if (!row) continue;
    let parts = row.split(",");
    if (parts.length < 4) continue;
    let date = parts[0];
    let sku = parts[1];
    let qty = Number(parts[3]);
    let month = date.split("-")[1];
    if (!month || !sku || isNaN(qty)) continue;
    if (!salesByMonth[month]) {
      salesByMonth[month] = {};
    }
    salesByMonth[month][sku] = (salesByMonth[month][sku] || 0) + qty;
  }
  let mostPopular = {};
  for (let month in salesByMonth) {
    let maxQty = 0;
    let popularItem = "";
    for (let item in salesByMonth[month]) {
      if (salesByMonth[month][item] > maxQty) {
        maxQty = salesByMonth[month][item];
        popularItem = item;
      }
    }
    mostPopular[month] = popularItem;
  }
  return mostPopular;
}

let mostPopular = mostPopularItem(data);
console.log(mostPopular);

function itemsGeneratingMostRevenue(data) {
  let monthRevenue = {};
  for (let i = 1; i < data.length; i++) {
    let row = data[i].trim();
    if (!row) continue;
    let parts = row.split(",");
    if (parts.length < 5) continue;
    let date = parts[0];
    let sku = parts[1];
    let total = Number(parts[4]);
    if (!date || !sku || isNaN(total)) continue;
    let month = date.split("-")[1];
    if (!month) continue;
    if (!monthRevenue[month]) {
      monthRevenue[month] = {};
    }
    monthRevenue[month][sku] = (monthRevenue[month][sku] || 0) + total;
  }
  let mostRevenueItem = {};
  for (let month in monthRevenue) {
    let maxRevenue = 0;
    let topItem = "";
    for (let sku in monthRevenue[month]) {
      if (monthRevenue[month][sku] > maxRevenue) {
        maxRevenue = monthRevenue[month][sku];
        topItem = sku;
      }
    }
    mostRevenueItem[month] = topItem;
  }
  return mostRevenueItem;
}

let mostRevenueItem = itemsGeneratingMostRevenue(data);
console.log(mostRevenueItem);

function minMaxAvgForMostPopularItem(data) {
  let monthItems = {};
  for (let i = 1; i < data.length; i++) {
    let row = data[i].trim();
    if (!row) continue;
    let [date, sku, unitPrice, qty, total] = row.split(",");
    if (!date || !sku || isNaN(qty)) continue;
    let month = date.split("-")[1];
    qty = Number(qty);
    if (!monthItems[month]) {
      monthItems[month] = {};
    }
    monthItems[month][sku] = (monthItems[month][sku] || 0) + qty;
  }
  let mostPopularItem = {};
  for (let month in monthItems) {
    let maxQty = 0;
    let popularItem = "";
    for (let sku in monthItems[month]) {
      if (monthItems[month][sku] > maxQty) {
        maxQty = monthItems[month][sku];
        popularItem = sku;
      }
    }
    mostPopularItem[month] = popularItem;
  }
  let result = {};
  for (let month in mostPopularItem) {
    let popularSku = mostPopularItem[month];
    let dailySales = [];
    for (let i = 1; i < data.length; i++) {
      let row = data[i].trim();
      if (!row) continue;
      let [date, sku, unitPrice, qty, total] = row.split(",");
      if (!date || !sku || isNaN(qty)) continue;
      let saleMonth = date.split("-")[1];
      if (sku === popularSku && saleMonth === month) {
        dailySales.push(Number(qty));
      }
    }
    if (dailySales.length > 0) {
      let minOrders = Math.min(...dailySales);
      let maxOrders = Math.max(...dailySales);
      let avgOrders = dailySales.reduce((sum, qty) => sum + qty, 0) / dailySales.length;
      result[month] = {
        minOrders: minOrders,
        maxOrders: maxOrders,
        avgOrders: avgOrders.toFixed(2),
      };
    } else {
      result[month] = {
        minOrders: 0,
        maxOrders: 0,
        avgOrders: "0.00",
      };
    }
  }
  return result;
}

const stats = minMaxAvgForMostPopularItem(data);
console.log(stats);
