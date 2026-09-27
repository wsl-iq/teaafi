# Taeafi — Release Notes v2.0.1

**Release Date:** 2026  
**Previous Version:** `v2.0.0` 
**Type:** Feature Release

---

## Overview

Version 2.0.1 introduces four new features designed to enhance user experience, provide deeper insights into recovery progress, and encourage daily engagement with the application. This release focuses purely on adding new capabilities without altering existing behavior.

---

## New Features

### 1. Quick Actions

A floating action button that provides instant access to the most frequently used features.

**Access:**

- Located at the top-left of the home screen.
- Uses a three-line menu icon that transforms into a red X when opened.
- Fixed position, remains accessible while scrolling.
- Fades out smoothly when scrolling down and returns when scrolling back to top.
- Visible only on the home page.

**Available Actions:**

| **Action** | **Description** |
| --- | --- |
| Quick Tasbih | Navigate directly to the tasbih page |
| Quick Note | Write a journal entry with mood selection without leaving the current page |
| Breathing Exercise | Open the breathing challenge |
| Quick Relapse Log | Record a relapse for the active habit |
| Emergency Mode | Display a calming message, a dua, and a 60-second countdown with coping options |

**Emergency Mode Features:**

- Random selection from five supportive messages.
- Random selection from five authentic duas.
- Three action buttons: "I am fine now", "Breathing Exercise", "Close".
- Auto-closes after 60 seconds.

---

### 2. Relapse Analysis

A comprehensive system for understanding patterns behind relapses.

**When Recording a Relapse:**

A modal appears with three optional steps:

1. **Trigger** — Select from 12 predefined triggers (stress, loneliness, boredom, late nights, phone use, family issues, financial problems, provocative content, lack of sleep, anger, sadness, other).
2. **Feeling** — Select from 4 emotional states (regretful, frustrated, neutral, determined).
3. **Lesson** — Optional free-text field (up to 500 characters).

The user can skip the modal entirely.

**Analysis Page:**

Accessible from the home page and the leaderboard page.

**Displays:**

- **Summary cards:** Total relapses, most common trigger, most dangerous time, most dangerous day.
- **Top Triggers:** Horizontal bar chart showing trigger frequency and percentage.
- **Dangerous Hours:** Distribution across morning, afternoon, evening, and night.
- **Dangerous Days:** Vertical bar chart showing relapse count per weekday.
- **Feelings Distribution:** Breakdown of emotional states after relapses.
- **Lessons Learned:** List of all recorded lessons, with dates.

**Filters:**

- By habit (all habits or a specific one).
- By time period (7 days, 30 days, 90 days, all time).

**Storage:**

- Records stored under `relapse_analysis_data`.
- Up to 500 records retained.

---

### 3. Habit Deep Dive

Detailed analytics section that appears at the bottom of every habit detail page.

**Sections:**

**Streak Cards:**

- Current streak (days since last relapse or since start).
- Longest streak (maximum gap between relapses).
- Total relapses.
- Success rate (percentage of clean days).

**Heatmap:**

- Visual grid of the last 60 days.
- Each box represents one day:
  - Green: clean day.
  - Red: relapse.
  - Gray: before recovery start.
- Today is highlighted with a pulsing animation.
- Hovering over a box shows the day name, date, and status.

**Dangerous Hours:**

- Distribution of relapses across four time periods.
- The most dangerous time is visually emphasized.
- Data drawn from Relapse Analysis records.

**Dangerous Days:**

- Bar chart showing relapse distribution across the seven weekdays.
- The most dangerous day is highlighted in red.

**Month Comparison:**

- Compares this month's relapse count with last month's.
- Three possible states: improved (green), worse (red), stable (orange).
- Displays a contextual message for each state.

**Personal Notes:**

- Free-text area for notes about the habit.
- Auto-saves after 2 seconds of inactivity.
- Manual save button available.
- Displays last save timestamp.

**Empty State:**

If the habit has no active recovery, a prompt is displayed with a button to start the recovery journey.

---

### 4. XP Bar

An inline progress bar displayed on the home page, directly below the search bar.

**Displays:**

| **Element** | **Description** |
| --- | --- |
| Level Icon | Font Awesome icon corresponding to the current level |
| Level Name | Text label for the current level |
| Level Number | The level number (e.g., "المستوى 3") |
| Progress Bar | Gold gradient bar showing progress toward the next level |
| Points Value | Current XP and target (e.g., "250 / 500") |
| Remaining XP | Points needed for the next level |

**Level System:**

| **Level** | **Name** | **Icon** | **Required XP** |
| ---: | --- | --- | ---: |
| 1 | مبتدئ | fa-seedling | 0 |
| 2 | متحمس | fa-leaf | 100 |
| 3 | مجتهد | fa-clover | 250 |
| 4 | مثابر | fa-tree | 500 |
| 5 | قوي | fa-dumbbell | 1000 |
| 6 | محارب | fa-shield-halved | 2000 |
| 7 | بطل | fa-trophy | 3500 |
| 8 | أسطورة | fa-crown | 5000 |
| 9 | خارق | fa-bolt | 7500 |
| 10 | معافي | fa-star | 10000 |

**XP Sources:**

| **Source** | **XP** |
| --- | ---: |
| Recovery day | 10 |
| Perfect week | 100 |
| 100 tasbih | 5 |
| Journal entry | 25 |
| Quiz completion | 50 |
| Challenge completion | 75 |
| Breathing exercise | 15 |
| Dua reading | 10 |
| 7-day streak | 150 |
| 30-day streak | 500 |
| New achievement | 200 |

**Features:**

- Updates automatically every 1.5 seconds.
- Shimmer animation on the progress bar.
- Golden glow animation when leveling up.
- Positioned inline, scrolls naturally with the page.
- Does not overlap with the bottom navigation.
- Full dark mode support.

---

## Summary of Additions

**New Files:**

| **File** | **Purpose** |
| --- | --- |
| `css/quick-actions.css` | Quick Actions styles |
| `js/quick-actions.js` | Quick Actions logic |
| `data/relapse-analysis.js` | Relapse Analysis data storage and analytics |
| `pages/relapse-analysis.js` | Relapse Analysis page and modal |
| `pages/habit-deep-dive.js` | Habit Deep Dive section |
| `css/xp-bar.css` | XP Bar styles |
| `js/xp-bar.js` | XP Bar logic and auto-refresh |

**Modified Files:**

| **File** | **Change** |
| --- | --- |
| `index.html` | Added new script and stylesheet links |
| `pages/home.js` | Added XP Bar injection |
| `pages/habit-detail.js` | Added Habit Deep Dive section |
| `pages/leaderboard.js` | Added Relapse Analysis link |
| `js/habit-controls.js` | Added Relapse Analysis modal trigger |
| `js/xp-system.js` | Added XP event dispatch |
| `js/router.js` | Registered `relapse-analysis` page |
| `css/components.css` | Added Relapse Analysis and Habit Deep Dive styles |

---

## User Flow

**Home Page:**

1. Search bar at the top.
2. XP Bar directly below the search bar.
3. Quick Actions button at the top-left.
4. Rest of the home page content.

**Recording a Relapse:**

1. User records a relapse from any page.
2. Confirmation dialog appears.
3. Relapse is saved.
4. Analysis modal appears (optional).
5. User selects trigger and feeling, optionally adds a lesson.
6. User saves or skips.

**Viewing Analysis:**

1. From home page or leaderboard, user taps "Relapse Analysis".
2. Page displays summary, charts, and lessons.
3. User can filter by habit or time period.

**Viewing Habit Details:**

1. User opens any habit.
2. Existing content is displayed.
3. Habit Deep Dive section appears at the bottom with analytics.

---

## Design Notes

- All new features follow the existing color scheme and typography.
- Dark mode is fully supported across all new components.
- Responsive design adapts to mobile, tablet, and desktop.
- All animations respect the `prefers-reduced-motion` setting.

---

**End of Release Notes — v2.0.1**