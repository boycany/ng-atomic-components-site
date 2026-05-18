import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Expander } from '../../shared/components/expander/expander';
import { MatDividerModule } from '@angular/material/divider';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-expander-showcase',
  imports: [Expander, MatDividerModule, Icon],
  templateUrl: './expander-showcase.html',
  styleUrl: './expander-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanderShowcase {
  readonly data = signal<ExpanderData[]>([
    {
      id: 1,
      header: 'Expander Example 1',
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae asperiores nobis reprehenderit minus magni natus harum totam cum amet eveniet.`,
    },
    {
      id: 2,
      header: 'Expander Example 2',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis explicabo cupiditate dolor voluptas culpa, laborum aspernatur cum tenetur excepturi blanditiis asperiores molestiae, est veniam labore incidunt exercitationem, magni neque earum! Illum laboriosam aliquam sequi vel molestias illo officia. Dolorum soluta nesciunt itaque voluptas! Obcaecati nostrum itaque provident nesciunt quaerat. Eius!',
    },
  ]);
}

interface ExpanderData {
  id: number;
  header: string;
  content: string;
}
