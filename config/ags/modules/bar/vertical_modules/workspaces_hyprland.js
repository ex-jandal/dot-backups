const { Gdk, Gtk } = imports.gi;
const Lang = imports.lang;
const Cairo = imports.cairo;
const Pango = imports.gi.Pango;
const PangoCairo = imports.gi.PangoCairo;
import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Box, DrawingArea, EventBox } = Widget;
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

const dummyWs = Box({ className: 'bar-ws' }); // Not shown. Only for getting size props
const dummyActiveWs = Box({ className: 'bar-ws bar-ws-active' }); // Not shown. Only for getting size props
const dummyOccupiedWs = Box({ className: 'bar-ws bar-ws-occupied' }); // Not shown. Only for getting size props

const mix = (value1, value2, perc) => {
    return value1 * perc + value2 * (1 - perc);
}

const getFontWeightName = (weight) => {
    switch (weight) {
        case Pango.Weight.ULTRA_LIGHT:
            return 'UltraLight';
        case Pango.Weight.LIGHT:
            return 'Light';
        case Pango.Weight.NORMAL:
            return 'Normal';
        case Pango.Weight.BOLD:
            return 'Bold';
        case Pango.Weight.ULTRA_BOLD:
            return 'UltraBold';
        case Pango.Weight.HEAVY:
            return 'Heavy';
        default:
            return 'Normal';
    }
}

// Number style conversion functions
const numberStyles = {
  'english': (n) => n.toString(),
  'arabic': (n) => n.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]),
  'persian': (n) => n.toString().replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]),
  'devanagari': (n) => n.toString().replace(/[0-9]/g, d => '०१२३४५६७८९'[d]),
  'bengali': (n) => n.toString().replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]),
  'thai': (n) => n.toString().replace(/[0-9]/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]),
  'japanese': (n) => n.toString().replace(/[0-9]/g, d => '〇一二三四五六七八九'[d]),
  'korean': (n) => n.toString().replace(/[0-9]/g, d => '영일이삼사오육칠팔구'[d]),
  'tamil': (n) => n.toString().replace(/[0-9]/g, d => '௦௧௨௩௪௫௬௭௮௯'[d]),
  'telugu': (n) => n.toString().replace(/[0-9]/g, d => '౦౧౨౩౪౫౬౭౮౯'[d]),
  'myanmar': (n) => n.toString().replace(/[0-9]/g, d => '၀၁၂၃၄၅၆၇၈၉'[d]),
  'khmer': (n) => n.toString().replace(/[0-9]/g, d => '០១២៣៤៥៦៧៨៩'[d])
};


const convertNumber = (number, style = 'arabic') => {
    const converter = numberStyles[style] || numberStyles.arabic;
    return converter(number);
};

// Font size = workspace id
const WorkspaceContents = (count = 10) => {
    return DrawingArea({
        className: 'bar-ws-container',
        hexpand: true,
        hpack: "center",
        attribute: {
            initialized: false,
            workspaceMask: 0,
            workspaceGroup: 0,
            updateMask: (self) => {
                const offset = Math.floor((Hyprland.active.workspace.id - 1) / count) * userOptions.asyncGet().workspaces.shown;
                // if (self.attribute.initialized) return; // We only need this to run once
                const workspaces = Hyprland.workspaces;
                let workspaceMask = 0;
                for (let i = 0; i < workspaces.length; i++) {
                    const ws = workspaces[i];
                    if (ws.id <= offset || ws.id > offset + count) continue; // Out of range, ignore
                    if (workspaces[i].windows > 0)
                        workspaceMask |= (1 << (ws.id - offset));
                }
                // console.log('Mask:', workspaceMask.toString(2));
                self.attribute.workspaceMask = workspaceMask;
                // self.attribute.initialized = true;
                self.queue_draw();
            },
            toggleMask: (self, occupied, name) => {
                if (occupied) self.attribute.workspaceMask |= (1 << parseInt(name));
                else self.attribute.workspaceMask &= ~(1 << parseInt(name));
                self.queue_draw();
            },
        },
        setup: (area) => area
            .hook(Hyprland.active.workspace, (self) => {
                self.setCss(`font-size: ${(Hyprland.active.workspace.id - 1) % count + 1}px;`);
                const previousGroup = self.attribute.workspaceGroup;
                const currentGroup = Math.floor((Hyprland.active.workspace.id - 1) / count);
                if (currentGroup !== previousGroup) {
                    self.attribute.updateMask(self);
                    self.attribute.workspaceGroup = currentGroup;
                }
            })
            .hook(Hyprland, (self) => self.attribute.updateMask(self), 'notify::workspaces')
            .on('draw', Lang.bind(area, (area, cr) => {
                const offset = Math.floor((Hyprland.active.workspace.id - 1) / count) * userOptions.asyncGet().workspaces.shown;

                const allocation = area.get_allocation();
                const { width, height } = allocation;

                const workspaceStyleContext = dummyWs.get_style_context();
                const workspaceDiameter = workspaceStyleContext.get_property('min-width', Gtk.StateFlags.NORMAL);
                const workspaceRadius = workspaceDiameter / 2;
                const workspaceFontSize = workspaceStyleContext.get_property('font-size', Gtk.StateFlags.NORMAL) / 4 * 3;
                const workspaceFontFamily = workspaceStyleContext.get_property('font-family', Gtk.StateFlags.NORMAL);
                const workspaceFontWeight = workspaceStyleContext.get_property('font-weight', Gtk.StateFlags.NORMAL);
                const wsbg = workspaceStyleContext.get_property('background-color', Gtk.StateFlags.NORMAL);
                const wsfg = workspaceStyleContext.get_property('color', Gtk.StateFlags.NORMAL);

                const occupiedWorkspaceStyleContext = dummyOccupiedWs.get_style_context();
                const occupiedbg = occupiedWorkspaceStyleContext.get_property('background-color', Gtk.StateFlags.NORMAL);
                const occupiedfg = occupiedWorkspaceStyleContext.get_property('color', Gtk.StateFlags.NORMAL);

                const activeWorkspaceStyleContext = dummyActiveWs.get_style_context();
                const activebg = activeWorkspaceStyleContext.get_property('background-color', Gtk.StateFlags.NORMAL);
                const activefg = activeWorkspaceStyleContext.get_property('color', Gtk.StateFlags.NORMAL);
                
                // Set minimum width and height
                area.set_size_request(workspaceDiameter, workspaceDiameter * count);
                const widgetStyleContext = area.get_style_context();
                const activeWs = widgetStyleContext.get_property('font-size', Gtk.StateFlags.NORMAL);

                const activeWsCenterX = width / 2;
                const activeWsCenterY = -(workspaceDiameter / 2) + (workspaceDiameter * activeWs);

                // Font
                const layout = PangoCairo.create_layout(cr);
                const fontDesc = Pango.font_description_from_string(`${workspaceFontFamily[0]} ${getFontWeightName(workspaceFontWeight)} ${workspaceFontSize}`);
                layout.set_font_description(fontDesc);
                cr.setAntialias(Cairo.Antialias.BEST);
                // Get kinda min radius for number indicators
                layout.set_text("0".repeat(count.toString().length), -1);
                const [layoutWidth, layoutHeight] = layout.get_pixel_size();
                const indicatorRadius = Math.max(layoutWidth, layoutHeight) / 2 * 1.15; // smaller than sqrt(2)*radius
                const indicatorGap = workspaceRadius - indicatorRadius;

                for (let i = 1; i <= count; i++) {
                    if (area.attribute.workspaceMask & (1 << i)) {
                        // Draw bg highlight
                        cr.setSourceRGBA(occupiedbg.red, occupiedbg.green, occupiedbg.blue, occupiedbg.alpha);
                        const wsCenterX = width / 2;
                        const wsCenterY = -(workspaceRadius) + (workspaceDiameter * i);
                        if (!(area.attribute.workspaceMask & (1 << (i - 1)))) { // Top
                            cr.arc(wsCenterX, wsCenterY, workspaceRadius, Math.PI, 2 * Math.PI);
                            cr.fill();
                        }
                        else {
                            cr.rectangle(wsCenterX - workspaceRadius, wsCenterY - workspaceRadius, workspaceRadius * 2, workspaceRadius)
                            cr.fill();
                        }
                        if (!(area.attribute.workspaceMask & (1 << (i + 1)))) { // Bottom
                            cr.arc(wsCenterX, wsCenterY, workspaceRadius, 0, Math.PI);
                            cr.fill();
                        }
                        else {
                            cr.rectangle(wsCenterX - workspaceRadius, wsCenterY, workspaceRadius * 2, workspaceRadius)
                            cr.fill();
                        }
                    }
                }

                // Draw active ws
                cr.setSourceRGBA(activebg.red, activebg.green, activebg.blue, activebg.alpha);
                cr.arc(activeWsCenterX, activeWsCenterY, indicatorRadius, 0, 2 * Math.PI);
                cr.fill();

                // Draw workspace numbers
                for (let i = 1; i <= count; i++) {
                    const inactivecolors = area.attribute.workspaceMask & (1 << i) ? occupiedfg : wsfg;
                    if (i == activeWs) {
                        cr.setSourceRGBA(activefg.red, activefg.green, activefg.blue, activefg.alpha);
                    }
                    // Moving to
                    else if ((i == Math.floor(activeWs) && Hyprland.active.workspace.id < activeWs) || (i == Math.ceil(activeWs) && Hyprland.active.workspace.id > activeWs)) {
                        cr.setSourceRGBA(mix(activefg.red, inactivecolors.red, 1 - Math.abs(activeWs - i)), mix(activefg.green, inactivecolors.green, 1 - Math.abs(activeWs - i)), mix(activefg.blue, inactivecolors.blue, 1 - Math.abs(activeWs - i)), activefg.alpha);
                    }
                    // Moving from
                    else if ((i == Math.floor(activeWs) && Hyprland.active.workspace.id > activeWs) || (i == Math.ceil(activeWs) && Hyprland.active.workspace.id < activeWs)) {
                        cr.setSourceRGBA(mix(activefg.red, inactivecolors.red, 1 - Math.abs(activeWs - i)), mix(activefg.green, inactivecolors.green, 1 - Math.abs(activeWs - i)), mix(activefg.blue, inactivecolors.blue, 1 - Math.abs(activeWs - i)), activefg.alpha);
                    }
                    // Inactive
                    else
                        cr.setSourceRGBA(inactivecolors.red, inactivecolors.green, inactivecolors.blue, inactivecolors.alpha);

                    // Convert number to selected style
                    const numberStyle = userOptions.asyncGet().workspaces.style || 'arabic';
                    const displayNumber = convertNumber(i + offset, numberStyle);
                    layout.set_text(displayNumber, -1);
                    
                    const [layoutWidth, layoutHeight] = layout.get_pixel_size();
                    const x = (width - layoutWidth) / 2;
                    const y = -workspaceRadius + (workspaceDiameter * i) - (layoutHeight / 2);
                    cr.moveTo(x, y);
                    PangoCairo.show_layout(cr, layout);
                    cr.stroke();
                }
            }))
        ,
    })
}

export default () => EventBox({
    // onScrollUp: () => Hyprland.messageAsync(`dispatch workspace -1`).catch(print),
    // onScrollDown: () => Hyprland.messageAsync(`dispatch workspace +1`).catch(print),
    onMiddleClick: () => toggleWindowOnAllMonitors('osk'),
    onSecondaryClick: () => App.toggleWindow('overview'),
    vexpand: true,
    vpack: 'center',
    attribute: {
        clicked: false,
        ws_group: 0,
    },
    child: Box({
        homogeneous: true,
        vexpand: true,
        children: [
            Box({
                vexpand: true,
                children: [WorkspaceContents(userOptions.asyncGet().workspaces.shown)],
            })
        ]
    }),
    setup: (self) => {
        self.add_events(Gdk.EventMask.POINTER_MOTION_MASK);
        self.on('motion-notify-event', (self, event) => {
            if (!self.attribute.clicked) return;
            const [_, cursorX, cursorY] = event.get_coords();
            const widgetHeight = self.get_allocation().height;
            const wsId = Math.ceil(cursorY * userOptions.asyncGet().workspaces.shown / widgetHeight);
            Utils.execAsync(['lunactl', 'hyprland', 'workspace', `${wsId}`])
                .catch(print);
        })
        self.on('button-press-event', (self, event) => {
            if (event.get_button()[1] === 1) {
                self.attribute.clicked = true;
                const [_, cursorX, cursorY] = event.get_coords();
                const widgetHeight = self.get_allocation().height;
                const wsId = Math.ceil(cursorY * userOptions.asyncGet().workspaces.shown / widgetHeight);
                Utils.execAsync(['lunactl', 'hyprland', 'workspace', `${wsId}`])
                    .catch(print);
            }
            else if (event.get_button()[1] === 8) {
                Hyprland.messageAsync(`dispatch togglespecialworkspace`).catch(print);
            }
        })
        self.on('button-release-event', (self) => self.attribute.clicked = false);
    }
})
