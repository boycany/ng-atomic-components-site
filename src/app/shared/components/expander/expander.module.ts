import { Expander } from './expander';
import { ExpanderToggle } from './expander-toggle';
import { ExpanderToggleComponent } from './expander-toggle.component';

export const ExpanderModule = [Expander, ExpanderToggle, ExpanderToggleComponent];

// *Old way: Use NgModule
// const exportable = [Expander, ExpanderToggle] as const;

// @NgModule({
//   imports: [...exportable],
//   exports: [...exportable],
// })
// export class ExpanderModule {}
