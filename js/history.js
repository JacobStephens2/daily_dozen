// History view: calendar, streaks, and day-detail drill-down

import * as storage from './storage.js';
import { getCategoriesForDietType } from './categories.js';

export class HistoryView {
    constructor(app) {
        this.app = app;
        this.viewDate = new Date();
        this._escHandler = null;
    }

    open() {
        this.viewDate = new Date();
        this.render();
    }

    close() {
        const modal = document.querySelector('.history-modal');
        if (modal) modal.remove();
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
    }

    getCategories() {
        return getCategoriesForDietType(
            storage.loadDietType(this.app.currentProfile)
        );
    }

    getTotalServings(categories) {
        return categories.reduce((sum, c) => sum + c.servings, 0);
    }

    getDayCompleted(dayData, categories) {
        let completed = 0;
        categories.forEach(cat => {
            if (dayData && dayData[cat.id]) {
                completed += dayData[cat.id].length;
            }
        });
        return completed;
    }

    calculateStreak(data, categories, totalServings) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;

        // Check if today is complete — if so, include it
        const todayKey = today.toDateString();
        const todayCompleted = this.getDayCompleted(data[todayKey], categories);
        if (todayCompleted >= totalServings) {
            streak++;
        }

        // Count backwards from yesterday
        const d = new Date(today);
        d.setDate(d.getDate() - 1);

        while (true) {
            const dateKey = d.toDateString();
            const dayData = data[dateKey];
            if (!dayData) break;
            const completed = this.getDayCompleted(dayData, categories);
            if (completed >= totalServings) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    render() {
        this.close();

        const data = storage.loadData(this.app.currentProfile);
        const categories = this.getCategories();
        const totalServings = this.getTotalServings(categories);

        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();
        const monthName = this.viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Monthly stats
        let daysTracked = 0;
        let perfectDays = 0;

        // Build calendar cells
        let calendarHtml = '';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            calendarHtml += `<div class="history-day-header">${day}</div>`;
        });

        for (let i = 0; i < startDayOfWeek; i++) {
            calendarHtml += `<div class="history-day empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toDateString();
            const dayData = data[dateKey];
            const isFuture = date > today;
            const isToday = date.toDateString() === today.toDateString();

            let completed = 0;
            if (dayData) {
                completed = this.getDayCompleted(dayData, categories);
                daysTracked++;
                if (completed >= totalServings) perfectDays++;
            }

            const percentage = totalServings > 0 ? Math.round((completed / totalServings) * 100) : 0;
            let colorClass = 'history-day-none';
            if (!isFuture && dayData) {
                if (percentage >= 100) colorClass = 'history-day-full';
                else if (percentage >= 75) colorClass = 'history-day-high';
                else if (percentage >= 50) colorClass = 'history-day-mid';
                else if (percentage > 0) colorClass = 'history-day-low';
            }

            const futureClass = isFuture ? 'future' : '';
            const todayClass = isToday ? 'today' : '';
            const hasData = dayData && !isFuture ? 'has-data' : '';
            const clickable = !isFuture ? 'clickable' : '';

            calendarHtml += `
                <div class="history-day ${colorClass} ${futureClass} ${todayClass} ${hasData} ${clickable}"
                     data-date="${dateKey}"
                     ${hasData ? `title="${percentage}% complete — click to edit"` : !isFuture ? 'title="Click to edit"' : ''}>
                    <span class="history-day-number">${day}</span>
                    ${!isFuture && dayData ? `<span class="history-day-pct">${percentage}%</span>` : ''}
                </div>
            `;
        }

        const streak = this.calculateStreak(data, categories, totalServings);

        // Don't allow navigating past current month
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

        const modal = document.createElement('div');
        modal.className = 'history-modal';
        modal.innerHTML = `
            <div class="history-content">
                <div class="history-header">
                    <h3>History</h3>
                    <button class="history-close-btn" aria-label="Close history">&times;</button>
                </div>

                <div class="history-stats">
                    <div class="history-stat">
                        <span class="history-stat-value">${streak}</span>
                        <span class="history-stat-label">Day Streak</span>
                    </div>
                    <div class="history-stat">
                        <span class="history-stat-value">${perfectDays}</span>
                        <span class="history-stat-label">Perfect Days</span>
                    </div>
                    <div class="history-stat">
                        <span class="history-stat-value">${daysTracked}</span>
                        <span class="history-stat-label">Days Tracked</span>
                    </div>
                </div>

                <div class="history-nav">
                    <button class="history-nav-btn history-prev" aria-label="Previous month">&larr;</button>
                    <span class="history-month-label">${monthName}</span>
                    <button class="history-nav-btn history-next ${isCurrentMonth ? 'disabled' : ''}"
                            aria-label="Next month"
                            ${isCurrentMonth ? 'disabled' : ''}>&rarr;</button>
                </div>

                <div class="history-calendar">
                    ${calendarHtml}
                </div>

                <div class="history-legend">
                    <span class="history-legend-item"><span class="history-legend-color history-day-none"></span> No data</span>
                    <span class="history-legend-item"><span class="history-legend-color history-day-low"></span> &lt;50%</span>
                    <span class="history-legend-item"><span class="history-legend-color history-day-mid"></span> 50-74%</span>
                    <span class="history-legend-item"><span class="history-legend-color history-day-high"></span> 75-99%</span>
                    <span class="history-legend-item"><span class="history-legend-color history-day-full"></span> 100%</span>
                </div>

                <p class="history-hint">Tap a day to edit its entries</p>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => modal.classList.add('show'));

        // Event listeners
        modal.querySelector('.history-close-btn').addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        modal.querySelector('.history-prev').addEventListener('click', () => {
            this.viewDate.setMonth(this.viewDate.getMonth() - 1);
            this.render();
        });

        if (!isCurrentMonth) {
            modal.querySelector('.history-next').addEventListener('click', () => {
                this.viewDate.setMonth(this.viewDate.getMonth() + 1);
                this.render();
            });
        }

        modal.querySelectorAll('.history-day.clickable').forEach(cell => {
            cell.addEventListener('click', () => {
                const date = new Date(cell.dataset.date);
                this.close();
                this.app.navigateToDate(date);
            });
        });

        this._escHandler = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this._escHandler);
    }
}
