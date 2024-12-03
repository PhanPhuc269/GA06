const Handlebars = require('handlebars');
const User = require('@auth/models/User');
const { mutipleMongooseToObject } = require('../utils/mongoose');
const { mongooseToObject } = require('../utils/mongoose');



module.exports={
    sum: (a, b) => a + b,
    sortable: (field, sort) => {
      const sortType = field === sort.column ? sort.type : 'default';

      const icons = {
        default: 'fa-solid fa-sort',
        asc: 'fa-solid fa-arrow-down-short-wide',
        desc: 'fa-solid fa-arrow-down-wide-short',
      };

      const types = {
        default: 'desc',
        asc: 'desc',
        desc: 'asc',
      };

      const icon = icons[sortType];
      const type = types[sortType];

      const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);

      const output = `<a href="?_sort&column=${field}&type=${type}">
        <i class="${icon}"></i>
      </a>`;
        return new Handlebars.SafeString(output);
    },
    // eq: (media, type)=>{
    //   if (!media) {
    //     return false;
    //   }

    //   // Các phần mở rộng tệp phổ biến cho video và hình ảnh
    //   const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    //   const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];

    //   const fileExtension = media.split('.').pop().toLowerCase();

    //   // Kiểm tra loại tệp
    //   if (type === 'image') {
    //       return imageExtensions.includes(fileExtension);
    //   } else if (type === 'video') {
    //       return videoExtensions.includes(fileExtension);
    //   }

    //   return false;
    // },

    eq: (a, b) => a === b,
    formatDuration:(seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours}h ${minutes}m ${remainingSeconds}s`;
        },
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    ifEquals: (a, b, options) => (a === b ? options.fn(this) : options.inverse(this)),
    createPagination: (currentPage, totalPages) => {
      let pages = [];
      for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
      }
      return pages;
    },
    range: (start, end) => {
      let rangeArray = [];
      for (let i = start; i <= end; i++) {
        rangeArray.push(i);
      }
      return rangeArray;
    },     
    if: (condition, trueValue, falseValue) => {
      return condition ? trueValue : falseValue;
    },
    toNumber: (value) => {
     return Number(value);
    },
    
    
}