import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = SMUBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

/// SMU+ is a multi-page site (library/index.html, sports/football/index.html, ...).
/// Capacitor's default router sends every extension-less path to the root index.html (single-page apps),
/// so this router serves <folder>/index.html when it exists and only falls back to the root page otherwise.
struct MultiPageRouter: Router {
    var basePath: String = ""

    func route(for path: String) -> String {
        let pathUrl = URL(fileURLWithPath: path)
        guard pathUrl.pathExtension.isEmpty else { return basePath + path }
        let base = URL(fileURLWithPath: basePath).standardizedFileURL.path
        let candidate = URL(fileURLWithPath: basePath + path)
            .appendingPathComponent("index.html").standardizedFileURL.path
        if candidate.hasPrefix(base + "/") && FileManager.default.fileExists(atPath: candidate) {
            return candidate
        }
        return basePath + "/index.html"
    }
}

/// Bridge view controller that uses the multi-page router. Referenced by SceneDelegate and Main.storyboard.
class SMUBridgeViewController: CAPBridgeViewController {
    override func router() -> Router {
        return MultiPageRouter()
    }
}
