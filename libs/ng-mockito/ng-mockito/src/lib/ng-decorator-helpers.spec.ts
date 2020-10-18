import { Component, Pipe, PipeTransform } from '@angular/core';
import { getDecoratorMetadata } from './ng-decorator-helpers';

describe('Angular decorator helpers', () => {
  describe('getDecoratorMetadata', () => {
    it('should get Pipe metadata', () => {
      @Pipe({ name: 'test' })
      class TestPipe implements PipeTransform {
        transform() {
          return null;
        }
      }

      expect(getDecoratorMetadata(TestPipe, 'Pipe').name).toEqual('test');
    });

    it('should get Component metadata', () => {
      @Component({ template: 'test' })
      class TestComponent {}

      expect(getDecoratorMetadata(TestComponent, 'Component').template).toEqual(
        'test'
      );
    });

    it('should throw error if metadata was not found', () => {
      @Component({ template: 'test' })
      class TestComponent {}

      expect(() => getDecoratorMetadata(TestComponent, 'Pipe')).toThrowError(
        /Did not find decorator Pipe. Found: Component/
      );
    });
  });
});
