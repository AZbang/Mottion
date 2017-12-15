module.exports.A = [
  {
    map: ['A|B', 'A', 'A|B', 'A', 'A|B', 'A'],
    trim: 3,
    append: 'C',
    shuffle: true
  },
  {
    map: ['A', 'A', 'B', 'B', 'B', 'B'],
    trim: 4,
    shuffle: true
  }
];

module.exports.B = [
  {
    map: ['A', 'A|B', 'A|B', 'A|B', 'A|B', 'A|B'],
    shuffle: true
  },
  {
    map: ['B', 'B', 'B', 'B', 'B', 'B'],
    trim: 4,
    append: 'A'
  }
]
