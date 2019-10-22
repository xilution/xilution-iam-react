// Let enzyme use the adapter for our current React version
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({
    adapter: new Adapter(),
});

// Allow image snapshot comparisons in Puppeteer
import {toMatchImageSnapshot} from "jest-image-snapshot";

expect.extend({toMatchImageSnapshot});

const wait30Seconds = 30000;

jest.setTimeout(wait30Seconds);
