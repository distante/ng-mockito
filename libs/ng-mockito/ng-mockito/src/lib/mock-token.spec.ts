import { Inject, Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { when } from 'ts-mockito';
import { mockNg } from './mock-ng';
import { mockToken as _mockToken } from './mock-token';

describe.each`
  mockToken     | description
  ${mockNg}     | ${'using mock function'}
  ${_mockToken} | ${'using mockToken function'}
`(
  // describe.each`
  //   mockToken     | description
  //   ${_mockToken} | ${'using mockToken function'}
  // `
  'mock token ($description)',
  ({ mockToken }: { mockToken: typeof _mockToken }) => {
    it('should provide default interface mock', async () => {
      interface TestInterface {
        someFunction(): void;
      }

      const TEST_TOKEN = new InjectionToken<TestInterface>('an interface');

      @Injectable()
      class TestService {
        constructor(@Inject(TEST_TOKEN) public testToken: TestInterface) {}
      }
      TestBed.configureTestingModule({
        providers: [TestService, mockToken([TEST_TOKEN, TestService])],
      });

      expect(() =>
        TestBed.inject(TestService).testToken.someFunction()
      ).not.toThrow();
    });

    it('should provide stubbable interface mock', async () => {
      interface TestInterface {
        someValue: string;
      }

      const TEST_TOKEN = new InjectionToken<TestInterface>('an interface');

      @Injectable()
      class TestService {
        constructor(@Inject(TEST_TOKEN) public testToken: TestInterface) {}
      }
      TestBed.configureTestingModule({
        providers: [
          TestService,
          mockToken([TEST_TOKEN, TestService], (m) =>
            when(m.someValue).thenReturn('test')
          ),
        ],
      });

      expect(TestBed.inject(TestService).testToken.someValue).toEqual('test');
    });

    it('should provide interface fake value', async () => {
      interface TestInterface {
        someValue: string;
      }

      const TEST_TOKEN = new InjectionToken<TestInterface>('an interface');

      @Injectable()
      class TestService {
        constructor(@Inject(TEST_TOKEN) public testToken: TestInterface) {}
      }
      TestBed.configureTestingModule({
        providers: [
          TestService,
          mockToken([TEST_TOKEN, TestService], {
            useValue: { someValue: 'test' },
          }),
        ],
      });

      expect(TestBed.inject(TestService).testToken.someValue).toEqual('test');
    });

    it('should infer default values for value types when inferValue config is used', async () => {
      const TEST_TOKEN_1 = new InjectionToken<string>('');
      const TEST_TOKEN_2 = new InjectionToken<boolean>('');
      const TEST_TOKEN_3 = new InjectionToken<number>('');
      const TEST_TOKEN_4 = new InjectionToken<unknown[]>('');
      const TEST_TOKEN_5 = new InjectionToken<() => unknown>('');
      const TEST_TOKEN_6 = new InjectionToken<symbol>('');

      @Injectable()
      class TestService {
        constructor(
          @Inject(TEST_TOKEN_1) public testToken1: string,
          @Inject(TEST_TOKEN_2) public testToken2: boolean,
          @Inject(TEST_TOKEN_3) public testToken3: number,
          @Inject(TEST_TOKEN_4) public testToken4: unknown[],
          @Inject(TEST_TOKEN_5) public testToken5: () => unknown,
          @Inject(TEST_TOKEN_6) public testToken6: symbol
        ) {}
      }
      TestBed.configureTestingModule({
        providers: [
          TestService,
          mockToken([TEST_TOKEN_1, TestService]),
          mockToken([TEST_TOKEN_2, TestService]),
          mockToken([TEST_TOKEN_3, TestService]),
          mockToken([TEST_TOKEN_4, TestService]),
          mockToken([TEST_TOKEN_5, TestService]),
          mockToken([TEST_TOKEN_6, TestService]),
        ],
      });

      const testService = TestBed.inject(TestService);

      expect(testService.testToken1).toEqual('');
      expect(testService.testToken2).toEqual(false);
      expect(testService.testToken3).toEqual(0);
      expect(testService.testToken4).toEqual([]);
      expect(testService.testToken5).toBeInstanceOf(Function);
      expect(testService.testToken5()).toBeUndefined();
      expect(typeof testService.testToken6).toBe('symbol');
    });

    it('should provide value when value config is used', async () => {
      const TEST_TOKEN_1 = new InjectionToken<string>('');
      const TEST_TOKEN_2 = new InjectionToken<boolean>('');
      const TEST_TOKEN_3 = new InjectionToken<number>('');
      const TEST_TOKEN_4 = new InjectionToken<unknown[]>('');
      const TEST_TOKEN_5 = new InjectionToken<() => unknown>('');
      const TEST_TOKEN_6 = new InjectionToken<symbol>('');
      const TEST_TOKEN_7 = new InjectionToken<SomeClass>('');
      const TEST_TOKEN_8 = new InjectionToken<SomeInterface>('');

      abstract class SomeClass {
        x = 'real';
      }

      interface SomeInterface {
        x: string;
      }

      @Injectable()
      class TestService {
        constructor(
          @Inject(TEST_TOKEN_1) public testToken1: string,
          @Inject(TEST_TOKEN_2) public testToken2: boolean,
          @Inject(TEST_TOKEN_3) public testToken3: number,
          @Inject(TEST_TOKEN_4) public testToken4: unknown[],
          @Inject(TEST_TOKEN_5) public testToken5: () => unknown,
          @Inject(TEST_TOKEN_6) public testToken6: symbol,
          @Inject(TEST_TOKEN_7) public testToken7: SomeClass,
          @Inject(TEST_TOKEN_8) public testToken8: SomeInterface
        ) {}
      }
      TestBed.configureTestingModule({
        providers: [
          TestService,
          mockToken([TEST_TOKEN_1, TestService], { useValue: 'test' }),
          mockToken([TEST_TOKEN_2, TestService], { useValue: true }),
          mockToken([TEST_TOKEN_3, TestService], { useValue: 7357 }),
          mockToken([TEST_TOKEN_4, TestService], { useValue: ['test'] }),
          mockToken([TEST_TOKEN_5, TestService], { useValue: () => 'test' }),
          mockToken([TEST_TOKEN_6, TestService], { useValue: Symbol('test') }),
          mockToken([TEST_TOKEN_7, TestService], { useValue: { x: 'test' } }),
          mockToken([TEST_TOKEN_8, TestService], { useValue: { x: 'test' } }),
        ],
      });

      const testService = TestBed.inject(TestService);

      expect(testService.testToken1).toEqual('test');
      expect(testService.testToken2).toEqual(true);
      expect(testService.testToken3).toEqual(7357);
      expect(testService.testToken4).toEqual(['test']);
      expect(testService.testToken5()).toEqual('test');
      expect(testService.testToken6.toString()).toEqual('Symbol(test)');
      expect(testService.testToken7).toEqual({ x: 'test' });
      expect(testService.testToken8).toEqual({ x: 'test' });
    });
  }
);
