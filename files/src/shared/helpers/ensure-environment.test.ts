import {environment as base} from 'src/environments/environment';
import {environment as e2e} from 'src/environments/environment.e2e';
import {environment as pdbBase} from 'src/environments/environment.pdb';
import {environment as setelPreprod} from 'src/environments/environment.preprod';
import {environment as pdbPreprod} from 'src/environments/environment.preprod.pdb';
import {environment as setelProd} from 'src/environments/environment.prod';
import {environment as pdbProd} from 'src/environments/environment.prod.pdb';
import {environment as setelSandbox} from 'src/environments/environment.sandbox';
import {environment as setelStaging} from 'src/environments/environment.staging';
import {environment as pdbStaging} from 'src/environments/environment.staging.pdb';

describe('environment', () => {
  it('has same property for all environments', () => {
    expect(Object.keys(base).sort()).toEqual(Object.keys(setelStaging).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(setelPreprod).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(setelSandbox).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(setelProd).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(pdbBase).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(pdbStaging).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(pdbPreprod).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(pdbProd).sort());
    expect(Object.keys(base).sort()).toEqual(Object.keys(e2e).sort());
  });
});
