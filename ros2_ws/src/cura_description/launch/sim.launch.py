import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node
import xacro
from launch.actions import (
    IncludeLaunchDescription,
    DeclareLaunchArgument,
    SetEnvironmentVariable
)

def generate_launch_description():
    # ========================================================================
    # 1. SETUP PATHS & FILES
    # ========================================================================
    pkg_name = 'cura_description'
    pkg_share = get_package_share_directory(pkg_name)
    pkg_ros_gz_sim = get_package_share_directory('ros_gz_sim')

    # Path to URDF (Xacro)
    xacro_file = os.path.join(pkg_share, 'urdf', 'cura.xacro')
    
    # Path to Bridge Config
    bridge_config_file = os.path.join(pkg_share, 'config', 'bridge_config.yaml')
    
    # Path to RViz Config
    rviz_config_file = os.path.join(pkg_share, 'rviz', 'cura.rviz')

    # Path to EKF Config
    ekf_config_file = os.path.join(pkg_share, 'config', 'ekf.yaml')

    # === ADDED: Path to your custom world ===
    world_file_name = 'hospital_ward.sdf' # Change this if your world file has a different name
    world_file = 'empty.sdf'  # Default to empty world if the specified world file is not found
    world_path = os.path.join(pkg_share, 'hospital_ward', world_file_name)

    # Process Xacro
    doc = xacro.process_file(xacro_file)
    robot_desc = doc.toxml()

    # ========================================================================
    # 2. DEFINE ARGUMENTS
    # ========================================================================
    
    #Declare the world argument
    world_arg = DeclareLaunchArgument(
        'world',
        default_value=world_path,
        description='Gazebo world file to load'
    )

    pkg_share = get_package_share_directory(pkg_name)

    gazebo_resource_path = os.path.dirname(pkg_share)

    hospital_model_path = os.path.join(
        pkg_share,
        'hospital_ward'
    )

    gazebo_resource_path = os.pathsep.join([
        os.path.dirname(pkg_share),
        pkg_share,
        hospital_model_path
    ])

    set_gazebo_resource_path = SetEnvironmentVariable(
        name='GZ_SIM_RESOURCE_PATH',
        value=gazebo_resource_path
    )
    # ========================================================================
    # 3. DEFINE NODES
    # ========================================================================

    # A. Robot State Publisher
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        output='screen',
        parameters=[{
            'robot_description': robot_desc,
            'use_sim_time': True
        }]
    )

    # B. Gazebo Simulation
    # Modified to load the world file instead of empty.sdf
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(pkg_ros_gz_sim, 'launch', 'gz_sim.launch.py')
        ),
        launch_arguments={
            'gz_args': ['-r -v 4 ', world_path]  # Use the world argument here
        }.items()
    )

    # C. Spawn Entity
    spawn_entity = Node(
        package='ros_gz_sim',
        executable='create',
        arguments=[
            '-topic', 'robot_description',
            '-name', 'cura',
            # Spawn at hospital entrance
            '-x', '0.0',
            '-y', '-2.5',
            '-z', '0.1',

            # Face into the hospital (+Y direction)
            '-Y', '1.5708',
        ],
        output='screen'
    )

    # D. Bridge
    bridge = Node(
        package='ros_gz_bridge',
        executable='parameter_bridge',
        parameters=[{
            'config_file': bridge_config_file,
            'use_sim_time': True
        }],
        output='screen'
    )

    # E. RViz2
    rviz = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', rviz_config_file],
        parameters=[{'use_sim_time': True}],
        output='screen'
    )

    # F. Robot Localization Node (EKF)
    robot_localization_node = Node(
        package='robot_localization',
        executable='ekf_node',
        name='ekf_filter_node',
        output='screen',
        parameters=[ekf_config_file]
    )

    # ========================================================================
    # 4. RETURN LAUNCH DESCRIPTION
    # ========================================================================
    return LaunchDescription([
        world_arg,
        set_gazebo_resource_path,
        gazebo,
        robot_state_publisher,
        spawn_entity,
        bridge,
        robot_localization_node,  
        rviz
    ])