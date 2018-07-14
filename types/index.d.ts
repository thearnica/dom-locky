type LockyEventHandler = (true | false | 'no-default' | 'report' | 'report-only');

interface Props {
  noDefault?: boolean,
  group?: string,
  onEscape?: () => void,
  events?: {
    click?: LockyEventHandler,
    mousemove?: LockyEventHandler,
    mousedown?: LockyEventHandler,
    touchmove?: LockyEventHandler,
    touchstart?: LockyEventHandler,
    keydown?: LockyEventHandler,
    change?: LockyEventHandler,
    scroll?: LockyEventHandler,
    wheel?: LockyEventHandler,
  }
}

type RemoveLocky = () => void;

export function lockyOn(selector: string | HTMLElement, settings?: Props): RemoveLocky;

export function lockyGroup(selector: string, group: string): void;