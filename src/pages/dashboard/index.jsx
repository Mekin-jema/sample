/**
 * Index File for Component Exports
 *
 * This file serves as a central export point for all components in the application.
 * It allows for cleaner and more organized imports in other files.
 *
 * Exported Components:
 * - AccountSettings: Component for managing user account settings.
 * - ApiClients: Component for managing API clients.
 * - Billing: Component for handling billing and payment information.
 * - Board: Component for displaying dashboard metrics and controls.
 * - Map: Component for rendering an interactive map with various features.
 * - Premium: Component for premium features or subscriptions.
 */

import Board from "./board/dashboard"; // Dashboard metrics and controls component
import Map from "./map/map"; // Interactive map component

// Export all components
export { Board, Map };
