import { DateFilter } from './date-filter/date-filter.model';
import { TextFilter } from './text-filter/text-filter.model';
import { NumberFilter } from './number-filter/number-filter.model';
import { ArrayFilter } from './array-filter/array-filter.model';

// Use ES6 Object Literal Property Value Shorthand to maintain a map
// where the keys share the same names as the classes themselves
const classes = {
    DateFilter,
    TextFilter,
    NumberFilter,
    ArrayFilter
};

class DynamicFilter {
    constructor (className,opts) {
        return new classes[className](opts);
    }
}

export default DynamicFilter;