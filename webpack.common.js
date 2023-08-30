// const path = require('path');

// module.exports = {
//   mode: 'development',
//   entry: './src/js/index.js',
//   devtool: 'inline-source-map',
//   target: 'electron-renderer',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [[
//               '@babel/preset-env', {
//                 targets: {
//                   esmodules: true
//                 }
//               }],
//               '@babel/preset-react']
//           }
//         }
//       },
//       {
//         test: [/\.s[ac]ss$/i, /\.css$/i],
//         use: [
//           // Creates `style` nodes from JS strings
//           'style-loader',
//           // Translates CSS into CommonJS
//           'css-loader',
//           // sass loader 
//           'sass-loader'

//         ],
//       },
//       {
//         test: /\.(png|jpe?g|gif|svg)$/i,
//         use: [
//           {
//             loader: 'file-loader',
//             options: {
//               name: '[name].[ext]',
//               outputPath: 'images', // or any other directory you want
//             },
//           },
          

//         ],
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['.js'],
//   },
//   output: {
//     filename: 'app.js',
//     path: path.resolve(__dirname, 'build', 'js'),
//   },
// };

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  devtool: 'inline-source-map',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  esmodules: true
                }
              }],
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build', 'js'),
  },
};
