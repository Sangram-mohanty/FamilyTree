import { ElementRef } from '@angular/core';
import { FamilyGraphComponent } from './family-graph.component';

describe('FamilyGraphComponent', () => {
  it('downloads the rendered family graph as a PDF', async () => {
    const component = new FamilyGraphComponent();
    component.family = {
      _id: 'tree-1',
      name: 'Mohanty Family',
      village: 'Bahadalapur',
      state: 'Odisha',
      surname: 'Mohanty'
    };
    component.people = [{ _id: 'person-1', name: 'Ramesh', gender: 'Man', birthYear: 1970 }];
    const viewport = document.createElement('div');
    viewport.className = 'parchment';
    viewport.textContent = 'Rendered family graph';
    viewport.style.width = '400px';
    viewport.style.height = '300px';
    document.body.appendChild(viewport);
    component.viewport = new ElementRef(viewport);

    const createObjectUrl = spyOn(URL, 'createObjectURL').and.returnValue('blob:family-data');
    const createElement = document.createElement.bind(document);
    let downloadLink: HTMLAnchorElement | undefined;
    spyOn(document, 'createElement').and.callFake((tagName: string): HTMLElement => {
      const element = createElement(tagName);
      if (tagName === 'a') downloadLink = element as HTMLAnchorElement;
      return element;
    });
    spyOn(HTMLAnchorElement.prototype, 'click');

    await component.downloadPdf();
    viewport.remove();

    expect(downloadLink?.download).toBe('Mohanty-Family-graph.pdf');
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
    const blob = createObjectUrl.calls.mostRecent().args[0] as Blob;
    expect(blob.type).toBe('application/pdf');
    const pdfContent = await blob.text();
    expect(pdfContent.startsWith('%PDF-')).toBeTrue();
  });
});
