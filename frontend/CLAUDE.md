## Massachusetts Design System — Style Guide

Source: https://www.mass.gov/style-guide  
This project targets the MA Design System. All UI work should follow these tokens.

### Brand Colors

| Name | Hex | Role |
|---|---|---|
| Bay Blue | `#14558F` | Primary brand color — buttons, headers, interactive elements |
| Berkshires Green | `#388557` | Accent / secondary elements |
| Duckling Yellow | `#F6C51B` | Highlight only — use sparingly to draw attention |
| Independence Cranberry | `#680A1D` | Supporting — multicolor graphics only, not interactive |
| Granite Gray | `#535353` | Neutral backgrounds and surfaces |

#### Bay Blue interactive states
| State | Background | Text |
|---|---|---|
| Default | `#14558F` | white |
| Hover | `#4377A5` | white |
| Active | `#104472` | white |
| Disabled | `#F0F0F0` | gray |
| Focus border | `#0088FF` | — |

#### Berkshires Green interactive states
| State | Background | Text |
|---|---|---|
| Default | `#32784E` | white |
| Hover | `#388557` | white |
| Active | `#275D3D` | white |
| Disabled | `#F0F0F0` | gray |
| Focus border | `#0088FF` | — |

### Utility / Semantic Colors

| Name | Hex | Use |
|---|---|---|
| Success Green | `#24A850` | Positive outcomes, confirmations |
| Warning Yellow | `#F6B622` | Caution, incomplete tasks, upcoming deadlines |
| Danger Red | `#CD0D0D` | Errors, destructive actions, system failures |
| Focus (light bg) | `#0088FF` | Keyboard/programmatic focus ring |
| Focus (dark bg) | `#B2DBFF` | Focus ring on dark surfaces |

Utility colors are reserved for system states — never use decoratively.

### Typography

**Typeface:** Noto Sans (free via Google Fonts)  
- Headings: Noto Sans SemiBold (weight 600)  
- Body: Noto Sans Regular (weight 400), minimum 16px, 180% line height  
- Labels (buttons, form labels, menus): Noto Sans, short text only  
- Use italics only to enhance meaning (titles, foreign words) — never for full paragraphs  
- Keep paragraph width below 75 characters per line  

**Type scale (4px system, implement in REM):**

| Token | px | rem |
|---|---|---|
| type-size-175 | 14 | 0.875 |
| type-size-200 | 16 | 1 |
| type-size-225 | 18 | 1.125 |
| type-size-250 | 20 | 1.25 |
| type-size-300 | 24 | 1.5 |
| type-size-350 | 28 | 1.75 |
| type-size-400 | 32 | 2 |
| type-size-450 | 36 | 2.25 |
| type-size-500 | 40 | 2.5 |

### Corner Radius

4px unit system:
- Elements ≥ 44×44px (buttons, cards, inputs, alerts): **8px**
- Elements 25–43px: **4px**
- Elements ≤ 24px: **2px**

### Elevation

Use shadow/color elevation on cards and pop-up menus to show depth. Never decorative — always functional. Use consistent levels across similar components.

### Iconography

Library: **Phosphor Icons** (open source)  
- Regular weight: icons larger than 24px  
- Bold weight: icons 24px and below  
- Every icon must serve a purpose (status, action, or content reinforcement)  
- Same icon = same meaning everywhere  
- Always pair with a text label or tooltip when meaning isn't immediately clear  
- Never use icons as the sole way to communicate information  

Custom MA icons exist for government-specific needs — contact designsystem@mass.gov if Phosphor doesn't cover a use case.

### Imagery

- Use real, inclusive photos — no staged stock images  
- Full color only (no B&W or sepia)  
- Meaningful alt text on all images; `alt=""` for purely decorative ones  
- No text embedded in images  
- Modern formats preferred: WebP, AVIF  
- Responsive images: use `srcset`/`sizes`  
- Lazy-load below-the-fold images  

### Angular Material Mapping

| MA Token | Angular Material target |
|---|---|
| Bay Blue `#14558F` | `primary` palette in `mat.theme()` |
| Berkshires Green `#388557` | `tertiary` palette in `mat.theme()` |
| Noto Sans | `typography` in `mat.theme()` |
| Utility colors | `--mat-sys-error`, success/warning custom variables |
| Focus `#0088FF` | matches Material 3 default — leave as-is |
