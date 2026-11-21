// Black / yellow / white theme: the old green, red and yellow classes are remapped so every page follows the brand
module.exports = { content: ['./app/**/*.js', './components/**/*.js'],
  theme: { extend: { colors: {
    green: { 50: '#F8F8F8', 100: '#FFF3B0', 600: '#FFD500', 700: '#111111', 800: '#000000' },
    red: { 500: '#111111', 600: '#111111' }, yellow: { 400: '#FFD500' } } } }, plugins: [] }
