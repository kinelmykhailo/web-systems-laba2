export class NotificationService {
  private static modalContainer: HTMLElement | null = null;

  static showModal(title: string, message: string, onClose?: () => void): void {
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.className = 'custom-modal-overlay';
      document.body.appendChild(this.modalContainer);
    }

    this.modalContainer.innerHTML = `
      <div class="custom-modal-content">
        <h3>${title}</h3>
        <p>${message}</p>
        <button id="modal-close-btn" class="btn btn-primary">Зрозуміло!</button>
      </div>
    `;

    this.modalContainer.style.display = 'flex';

    const btn = document.getElementById('modal-close-btn');
    if (btn) {
      btn.onclick = () => {
        if (this.modalContainer) {
          this.modalContainer.style.display = 'none';
        }
        if (onClose) onClose();
      };
    }
  }

  static showPrompt(title: string, callback: (value: string) => void): void {
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.className = 'custom-modal-overlay';
      document.body.appendChild(this.modalContainer);
    }

    this.modalContainer.innerHTML = `
      <div class="custom-modal-content">
        <h3>${title}</h3>
        <input type="text" id="modal-input" class="form-control mb-3" placeholder="ID користувача">
        <div class="d-flex justify-content-end gap-2">
          <button id="modal-cancel-btn" class="btn btn-secondary">Скасувати</button>
          <button id="modal-save-btn" class="btn btn-primary">Зберегти</button>
        </div>
      </div>
    `;

    this.modalContainer.style.display = 'flex';

    const input = document.getElementById('modal-input') as HTMLInputElement;
    const saveBtn = document.getElementById('modal-save-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    if (saveBtn && input) {
      saveBtn.onclick = () => {
        const val = input.value.trim();
        if (this.modalContainer) this.modalContainer.style.display = 'none';
        callback(val);
      };
    }

    if (cancelBtn) {
      cancelBtn.onclick = () => {
        if (this.modalContainer) this.modalContainer.style.display = 'none';
      };
    }
  }
}