
// Establish weight of each factor
a = 0.1429
b = 0.1429
c = 0.1429
d = 0.1429
e = 0.1429
f = 0.1429
g = 0.1429

// calculate the quality of life column
qolDF["Quality of Life"] = round(qolDF['Stability'] * a + qolDF['Rights'] * b + qolDF['Health'] * c + qolDF['Safety'] * d + qolDF['Climate'] * e + qolDF['Costs'] * f + qolDF['Popularity'] * g)
qolDF.head()
